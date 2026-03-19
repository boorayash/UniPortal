const sendEmail = async (options) => {
    // 1) Check if Brevo API key is available
    if (process.env.BREVO_API) {
        const url = 'https://api.brevo.com/v3/smtp/email';
        
        // Use EMAIL_USER if provided, otherwise a fallback sender
        const senderEmail = process.env.EMAIL_USER;

        const payload = {
            sender: { 
                name: 'UniPortal Admin', 
                email: senderEmail 
            },
            to: [{ 
                email: options.email 
            }],
            subject: options.subject,
            textContent: options.message,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Brevo API Error:', errorData);
                throw new Error(`Brevo Email Failed: ${response.statusText}`);
            }

            console.log(`✅ Brevo email sent successfully to: ${options.email}`);
        } catch (error) {
            console.error('❌ Error sending email via Brevo:', error);
            throw error;
        }
    } else {
        // FALLBACK: Useful for testing if Brevo API is not configured
        console.log('--- 📧 SIMULATED EMAIL SENT (Brevo API missing) ---');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: ${options.message}`);
        console.log('---------------------------------------------------');
    }
};

module.exports = sendEmail;
