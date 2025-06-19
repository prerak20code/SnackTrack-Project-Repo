import axios from 'axios';

async function sendMail({ to, subject, text, html }) {
    if (!process.env.BREVO_API_KEY) {
        throw new Error('❌ BREVO_API_KEY not set in environment variables');
    }

    try {
        const response = await axios.post(
            'https://api.sendinblue.com/v3/smtp/email',
            {
                sender: {
                    name: 'Snack Track',
                    email: 'no-reply@snacktrack.me',
                },
                to: [{ email: to }],
                subject: subject || 'No particular subject',
                textContent: text,
                htmlContent: html,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                },
            }
        );

        return response.data;
    } catch (err) {
        throw new Error(
            `❌ Error sending Brevo email: ${err.response?.data?.message || err.message}`
        );
    }
}

export { sendMail };
