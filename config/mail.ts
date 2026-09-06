import nodemailer from "nodemailer";
import { logger } from "../utils/logger.util.js";

export interface MailAttachment {
    filename: string;
    content: string | Buffer;
    contentType?: string;
}

const sendMail = async (
    to: string,
    subject: string,
    html: string,
    attachments?: MailAttachment[]
) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sheeladecorproject@gmail.com",
                pass: process.env.APP_PASSWORD
            }
        });

        const mailOptions: any = {
            from: "'Sheela Decor' <sheeladecorproject@gmail.com>",
            to: to,
            subject: subject,
            html
        };

        if (attachments && attachments.length > 0) {
            mailOptions.attachments = attachments;
        }

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (err: any) {
        logger.warn("Error while sending mail", { err: err?.message || err });
    }
};

export { sendMail };