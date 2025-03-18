import nodemailer from 'nodemailer';

let transporter;

async function generateTransporter() {
    try {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
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
}

async function sendMail({
    to = '',
    subject = 'No particular subject', // to avoid spam mails
    text = '',
    html = '',
}) {
    if (!transporter) throw new Error('❌ Transporter not initialized.');

    try {
        return await transporter.sendMail({
            from: `Snack Track <${process.env.MAIL_SENDER_EMAIL}>`,
            to,
            subject,
            text,
            html,
        });
    } catch (err) {
        throw new Error(`❌ Error sending mail: ${err.message}`);
    }
}

export { generateTransporter, sendMail };
