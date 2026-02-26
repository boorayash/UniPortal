const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // If you have set up SMTP env variables, this will use them.
    // Otherwise, it will log to console as a fallback.
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 465,
            secure: process.env.EMAIL_PORT == 465, // Use SSL for port 465
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // 2) Define email options
        const mailOptions = {
            from: `UniPortal Admin <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        // 3) Send the email
        try {
            await transporter.sendMail(mailOptions);
            console.log(`✅ Real email sent to: ${options.email}`);
        } catch (error) {
            console.error('❌ Error sending real email:', error);
            throw error;
        }
    } else {
        // FALLBACK: Useful for testing if SMTP is not configured
        console.log('--- 📧 SIMULATED EMAIL SENT (Config missing) ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('-----------------------------------------------');
    }
};

module.exports = sendEmail;
