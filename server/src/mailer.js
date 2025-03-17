import nodemailer from 'nodemailer';

let transporter;

// IIFE to initialize transporter

(async function generateTransporter() {
    try {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_SENDER_EMAIL,
                pass: process.env.MAIL_SENDER_PASSWORD,
            },
        });

        // Test transporter
        await transporter.verify();
        console.log('✅ Mail transporter ready.');
    } catch (err) {
        console.error(`❌ Error generating mail transporter: ${err.message}`);
    }
})();

// Function to send mail
export async function sendMail({
    to = '',
    subject = '',
    text = '',
    html = '',
}) {
    if (!transporter) {
        throw new Error('❌ Transporter not initialized.');
    }

    try {
        const res = await transporter.sendMail({
            from: process.env.MAIL_SENDER_EMAIL,
            to,
            subject,
            text,
            html,
        });

        console.log(`📧 Mail sent to ${to}`);
        return res;
    } catch (err) {
        console.error(`❌ Error sending mail: ${err.message}`);
        throw err;
    }
}
