/**
 * Utility for RFC 4180 compliant CSV serialization.
 */

const SENSITIVE_KEYS = new Set(["password", "refreshToken", "refreshTokens", "token", "authSecret"]);

function sanitizeValue(val: any): string {
    if (val === null || val === undefined) {
        return "";
    }

    if (val instanceof Date) {
        return val.toISOString();
    }

    if (typeof val === "object") {
        if (typeof val.toNumber === "function" || typeof val.toString === "function" && val.constructor?.name === "Decimal") {
            return val.toString();
        }
        try {
            return JSON.stringify(val);
        } catch {
            return String(val);
        }
    }

    return String(val);
}

function escapeCsvCell(cell: string): string {
    if (cell.includes(",") || cell.includes("\"") || cell.includes("\n") || cell.includes("\r")) {
        return `"${cell.replace(/"/g, '""')}"`;
    }
    return cell;
}

/**
 * Flattens 1-level relations for clean CSV columns.
 * e.g. { id: '1', customer: { name: 'John' } } => { id: '1', customer_name: 'John' }
 */
export function flattenRecord(record: Record<string, any>, prefix = ""): Record<string, any> {
    const flattened: Record<string, any> = {};

    for (const [key, value] of Object.entries(record)) {
        if (SENSITIVE_KEYS.has(key)) {
            continue;
        }

        const fullKey = prefix ? `${prefix}_${key}` : key;

        if (value && typeof value === "object" && !(value instanceof Date) && typeof value.toNumber !== "function" && !Array.isArray(value) && value.constructor?.name !== "Decimal") {
            // Flatten 1-level nested object (like relation)
            const nested = flattenRecord(value, fullKey);
            Object.assign(flattened, nested);
        } else if (Array.isArray(value)) {
            flattened[fullKey] = JSON.stringify(value);
        } else {
            flattened[fullKey] = value;
        }
    }

    return flattened;
}

/**
 * Converts an array of objects to a CSV string.
 * @param records Array of objects to convert
 * @param customHeaders Optional explicit list of header names
 */
export function convertToCsv(records: any[], customHeaders?: string[]): string {
    if (!records || records.length === 0) {
        if (customHeaders && customHeaders.length > 0) {
            return customHeaders.map(escapeCsvCell).join(",") + "\r\n";
        }
        return "";
    }

    const flattenedRecords = records.map((r) => flattenRecord(r));

    // Determine all unique column headers across all records
    const headerSet = new Set<string>();
    flattenedRecords.forEach((rec) => {
        Object.keys(rec).forEach((k) => headerSet.add(k));
    });
    const headers = customHeaders || Array.from(headerSet);

    const headerLine = headers.map(escapeCsvCell).join(",");

    const rowLines = flattenedRecords.map((rec) => {
        return headers
            .map((h) => {
                const val = sanitizeValue(rec[h]);
                return escapeCsvCell(val);
            })
            .join(",");
    });

    return [headerLine, ...rowLines].join("\r\n");
}
