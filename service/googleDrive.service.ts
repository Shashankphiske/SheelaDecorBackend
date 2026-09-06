import crypto from "crypto";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.util.js";

interface TokenCache {
    token: string;
    expiresAt: number;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem
        .replace(/-----BEGIN[ A-Z0-9_-]+-----/g, "")
        .replace(/-----END[ A-Z0-9_-]+-----/g, "")
        .replace(/\\n/g, "")
        .replace(/\s+/g, "");
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer as ArrayBuffer;
}

export class GoogleDriveService {
    private tokenCache: TokenCache | null = null;

    /**
     * Checks if Google credentials (OAuth2 or Service Account) are provided.
     */
    isConfigured(): boolean {
        const hasOAuth = Boolean(config.googleClientId && config.googleClientSecret && config.googleRefreshToken);
        const hasServiceAccount = Boolean(config.googleClientEmail && config.googlePrivateKey);
        return hasOAuth || hasServiceAccount;
    }

    /**
     * Obtains an OAuth2 access token for Google Drive API.
     * Uses OAuth2 Refresh Token (recommended for personal Gmail with 15GB quota) or Service Account JWT fallback.
     */
    private async getAccessToken(): Promise<string> {
        if (this.tokenCache && Date.now() < this.tokenCache.expiresAt - 5 * 60 * 1000) {
            return this.tokenCache.token;
        }

        if (!this.isConfigured()) {
            throw new Error(
                "Google Drive credentials not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN in .env"
            );
        }

        // 1. Preferred: Standard OAuth2 User Refresh Token (Uses full 15GB personal quota)
        if (config.googleClientId && config.googleClientSecret && config.googleRefreshToken) {
            const res = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: config.googleClientId,
                    client_secret: config.googleClientSecret,
                    refresh_token: config.googleRefreshToken,
                    grant_type: "refresh_token",
                }),
            });

            if (!res.ok) {
                const errBody = await res.text();
                logger.error("Failed to obtain OAuth2 token from Google", { errBody });
                throw new Error(`Google OAuth2 error (${res.status}): ${errBody}`);
            }

            const data = (await res.json()) as { access_token: string; expires_in: number };
            this.tokenCache = {
                token: data.access_token,
                expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
            };

            return this.tokenCache.token;
        }

        // 2. Fallback: Service Account JWT flow
        const now = Math.floor(Date.now() / 1000);
        const header = { alg: "RS256", typ: "JWT" };
        const claimSet = {
            iss: config.googleClientEmail,
            scope: "https://www.googleapis.com/auth/drive",
            aud: "https://oauth2.googleapis.com/token",
            exp: now + 3600,
            iat: now,
        };

        const base64UrlEncode = (obj: any) =>
            Buffer.from(JSON.stringify(obj)).toString("base64url");

        const encodedHeader = base64UrlEncode(header);
        const encodedClaimSet = base64UrlEncode(claimSet);
        const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

        let signature: string;
        try {
            const keyBuffer = pemToArrayBuffer(config.googlePrivateKey);
            const cryptoKey = await crypto.subtle.importKey(
                "pkcs8",
                keyBuffer,
                { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
                false,
                ["sign"]
            );
            const signatureBuffer = await crypto.subtle.sign(
                "RSASSA-PKCS1-v1_5",
                cryptoKey,
                new TextEncoder().encode(signatureInput)
            );
            signature = Buffer.from(signatureBuffer).toString("base64url");
        } catch (subtleErr) {
            const signer = crypto.createSign("RSA-SHA256");
            signer.update(signatureInput);
            signer.end();
            signature = signer.sign(config.googlePrivateKey, "base64url");
        }

        const jwt = `${signatureInput}.${signature}`;

        const res = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion: jwt,
            }),
        });

        if (!res.ok) {
            const errBody = await res.text();
            logger.error("Failed to authenticate with Google OAuth", { errBody });
            throw new Error(`Google OAuth error (${res.status}): ${errBody}`);
        }

        const data = (await res.json()) as { access_token: string; expires_in: number };
        this.tokenCache = {
            token: data.access_token,
            expiresAt: Date.now() + data.expires_in * 1000,
        };

        return this.tokenCache.token;
    }

    /**
     * Finds an existing folder by name (and parent) or creates a new folder.
     */
    async findOrCreateFolder(folderName: string, parentFolderId?: string): Promise<string> {
        const token = await this.getAccessToken();

        let query = `name = '${folderName.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
        if (parentFolderId) {
            query += ` and '${parentFolderId}' in parents`;
        }

        const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
            query
        )}&fields=files(id,name)&spaces=drive&supportsAllDrives=true&includeItemsFromAllDrives=true`;

        const searchRes = await fetch(searchUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (searchRes.ok) {
            const data = (await searchRes.json()) as { files?: { id: string; name: string }[] };
            if (data.files && data.files.length > 0 && data.files[0]) {
                return data.files[0].id;
            }
        }

        // Create folder if not found
        const createBody: Record<string, any> = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
        };
        if (parentFolderId) {
            createBody.parents = [parentFolderId];
        }

        const createRes = await fetch("https://www.googleapis.com/drive/v3/files?supportsAllDrives=true&fields=id,name", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(createBody),
        });

        if (!createRes.ok) {
            const err = await createRes.text();
            throw new Error(`Failed to create Google Drive folder '${folderName}': ${err}`);
        }

        const created = (await createRes.json()) as { id: string };
        logger.info(`Created Google Drive folder '${folderName}'`, { folderId: created.id });
        return created.id;
    }

    /**
     * Ensures Root 'Data Backup' -> Year -> Month folder hierarchy exists.
     */
    async getOrCreateHierarchy(year: number | string, monthFolderName: string): Promise<{
        dataBackupRootId: string;
        yearFolderId: string;
        monthFolderId: string;
    }> {
        const parentId = config.googleDriveParentFolderId || undefined;
        const dataBackupRootId = await this.findOrCreateFolder("Data Backup", parentId);
        const yearFolderId = await this.findOrCreateFolder(String(year), dataBackupRootId);
        const monthFolderId = await this.findOrCreateFolder(monthFolderName, yearFolderId);

        return { dataBackupRootId, yearFolderId, monthFolderId };
    }

    /**
     * Ensures Root 'Master Data Backup' folder exists.
     */
    async getOrCreateMasterFolder(): Promise<string> {
        const parentId = config.googleDriveParentFolderId || undefined;
        return await this.findOrCreateFolder("Master Data Backup", parentId);
    }

    /**
     * Purges all existing files in a folder before fresh upload.
     */
    async purgeFolderContents(folderId: string): Promise<number> {
        const token = await this.getAccessToken();
        const query = `'${folderId}' in parents and trashed = false`;
        const listUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
            query
        )}&pageSize=1000&fields=files(id,name)&spaces=drive&supportsAllDrives=true&includeItemsFromAllDrives=true`;

        const listRes = await fetch(listUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!listRes.ok) {
            return 0;
        }

        const data = (await listRes.json()) as { files?: { id: string; name: string }[] };
        if (!data.files || data.files.length === 0) {
            return 0;
        }

        let deletedCount = 0;
        for (const file of data.files) {
            try {
                const delRes = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?supportsAllDrives=true`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (delRes.ok || delRes.status === 204) {
                    deletedCount++;
                }
            } catch (err) {
                logger.warn(`Failed to delete old backup file ${file.name} in folder ${folderId}`, { err });
            }
        }

        logger.info(`Purged ${deletedCount} old files from folder ${folderId}`);
        return deletedCount;
    }

    /**
     * Uploads or replaces a CSV file in a specific folder.
     */
    async uploadOrUpdateFile(
        folderId: string,
        fileName: string,
        fileContent: string,
        mimeType: string = "text/csv"
    ): Promise<{ fileId: string; name: string }> {
        const token = await this.getAccessToken();

        // Check if file already exists in folder
        const query = `name = '${fileName.replace(/'/g, "\\'")}' and '${folderId}' in parents and trashed = false`;
        const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
            query
        )}&fields=files(id,name)&spaces=drive&supportsAllDrives=true&includeItemsFromAllDrives=true`;

        const searchRes = await fetch(searchUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });

        let existingFileId: string | null = null;
        if (searchRes.ok) {
            const searchData = (await searchRes.json()) as { files?: { id: string; name: string }[] };
            if (searchData.files && searchData.files.length > 0 && searchData.files[0]) {
                existingFileId = searchData.files[0].id;
            }
        }

        if (existingFileId) {
            // Update existing file content
            const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media&supportsAllDrives=true`;
            const updateRes = await fetch(updateUrl, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": mimeType,
                },
                body: fileContent,
            });

            if (!updateRes.ok) {
                const err = await updateRes.text();
                throw new Error(`Failed to update Google Drive file '${fileName}': ${err}`);
            }

            return { fileId: existingFileId, name: fileName };
        }

        // Multipart upload for new file
        const boundary = "-------314159265358979323846";
        const delimiter = `\r\n--${boundary}\r\n`;
        const closeDelimiter = `\r\n--${boundary}--`;

        const metadata = {
            name: fileName,
            parents: [folderId],
            mimeType,
        };

        const multipartBody =
            delimiter +
            "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
            JSON.stringify(metadata) +
            delimiter +
            `Content-Type: ${mimeType}\r\n\r\n` +
            fileContent +
            closeDelimiter;

        const uploadUrl = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name";
        const uploadRes = await fetch(uploadUrl, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": `multipart/related; boundary=${boundary}`,
            },
            body: multipartBody,
        });

        if (!uploadRes.ok) {
            const err = await uploadRes.text();
            throw new Error(`Failed to upload Google Drive file '${fileName}': ${err}`);
        }

        const uploaded = (await uploadRes.json()) as { id: string; name: string };
        return { fileId: uploaded.id, name: uploaded.name };
    }

    /**
     * Shares a folder with a target Gmail address (writer or reader).
     */
    async shareFolder(folderId: string, gmailAddress: string, role: "writer" | "reader" = "writer"): Promise<boolean> {
        if (!gmailAddress || !gmailAddress.includes("@")) {
            return false;
        }

        try {
            const token = await this.getAccessToken();
            const shareUrl = `https://www.googleapis.com/drive/v3/files/${folderId}/permissions?supportsAllDrives=true&sendNotificationEmail=false`;

            const res = await fetch(shareUrl, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role,
                    type: "user",
                    emailAddress: gmailAddress.trim(),
                }),
            });

            if (!res.ok) {
                const errText = await res.text();
                logger.warn(`Warning sharing folder ${folderId} with ${gmailAddress}`, { errText });
                return false;
            }

            logger.info(`Successfully shared folder ${folderId} with ${gmailAddress}`);
            return true;
        } catch (err) {
            logger.warn(`Error sharing folder ${folderId} with ${gmailAddress}`, { err });
            return false;
        }
    }

    getFolderUrl(folderId: string): string {
        return `https://drive.google.com/drive/folders/${folderId}`;
    }
}
