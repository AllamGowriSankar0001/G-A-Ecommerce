const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sendWelcomeEmail = async (email) => {
    try {
        await emailApi.sendTransacEmail({
            sender: { email: process.env.SENDER_EMAIL },
            to: [{ email: email }],
            subject: "Welcome to G&A Ecommerce",
            htmlContent: `
<h2>Welcome to G&A Ecommerce 🎉</h2>
<p>Your account has been created successfully.</p>
<p>Email: ${email}</p>
`
        });

        console.log("Welcome email sent");
    } catch (error) {
        console.error("Brevo email error:", error);
    }
};

module.exports = sendWelcomeEmail;