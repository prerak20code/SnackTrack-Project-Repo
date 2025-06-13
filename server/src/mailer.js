import nodemailer from 'nodemailer';

console.log('📧 Using MAIL_SENDER_EMAIL:', process.env.MAIL_SENDER_EMAIL);
console.log(
    '🔑 MAIL_SENDER_PASSWORD starts with:',
    process.env.MAIL_SENDER_PASSWORD?.slice(0, 5)
);

let transporter = null;

async function generateTransporter() {
    if (transporter) return transporter;

    try {
        transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_SENDER_EMAIL,
                pass: process.env.MAIL_SENDER_PASSWORD,
            },
        });

        await transporter.verify();
        console.log('✅ Mail transporter ready.');
        return transporter;
    } catch (err) {
        console.error(`❌ Error generating mail transporter: ${err.message}`);
        transporter = null;
        throw err;
    }
}

async function sendMail({ to, subject, text, html }) {
    if (!transporter) throw new Error('❌ Transporter not initialized.');

    try {
        return await transporter.sendMail({
            from: `Snack Track <no-reply@snacktrack.me>`,
            to,
            subject: subject || 'No particular subject',
            text,
            html,
        });
    } catch (err) {
        console.error(`❌ Error sending mail: ${err.message}`);
        throw err;
    }
}

export { generateTransporter, sendMail };
