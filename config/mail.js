import nodemailer from "nodemailer";
import { logger } from "../utils/logger.util.js";
const sendMail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sheeladecorproject@gmail.com",
                pass: process.env.APP_PASSWORD
            }
        });
        const mailOptions = {
            from: "'Sheela Decor' <sheeladecorproject@gmail.com>",
            to: to,
            subject: subject,
            html
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    }
    catch (err) {
        logger.warn("Error while sending mail");
    }
};
export { sendMail };
//# sourceMappingURL=mail.js.map