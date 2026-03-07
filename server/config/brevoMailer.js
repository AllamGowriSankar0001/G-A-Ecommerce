const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();
const FRONTEND_URL = "https://g-a-ecommerce.vercel.app/";

const sendWelcomeEmail = async (email) => {
  try {
    await emailApi.sendTransacEmail({
      sender: { email: process.env.SENDER_EMAIL },
      to: [{ email }],
      subject: "Welcome to G&A Ecommerce",
      htmlContent: `
<div style="margin:0;padding:40px 0;background:#f3f4f6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.18);border:1px solid #e5e7eb;">

    <div style="background:#111827;color:#f9fafb;text-align:center;padding:22px 20px;border-bottom:1px solid rgba(148,163,184,0.35);">
      <div style="font-size:22px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">G&A Ecommerce</div>
      <div style="font-size:13px;opacity:0.8;margin-top:4px;">Curated fashion & lifestyle essentials</div>
    </div>

    <div style="padding:30px 28px 26px;">
      <p style="font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 10px;">Welcome</p>

      <h1 style="color:#0f172a;font-size:22px;margin:0 0 12px;line-height:1.35;">
        You're in, welcome to <span style="font-weight:700;">G&A</span>.
      </h1>

      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 12px;">
        Hi there,
      </p>

      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 16px;">
        Thanks for creating an account with <strong>G&A Ecommerce</strong>. You now have a
        personalised space to discover new arrivals, track your orders and manage your preferences.
      </p>

      <div style="border-radius:12px;background:#f9fafb;border:1px solid #e5e7eb;padding:14px 16px;margin:0 0 18px;">
        <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#6b7280;margin:0 0 6px;">
          Account details
        </div>
        <div style="font-size:14px;color:#111827;margin:0;">
          <span style="color:#6b7280;">Registered email:</span>
          <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;padding-left:6px;">
            ${email}
          </span>
        </div>
      </div>

      <div style="margin:0 0 16px;">
        <p style="color:#4b5563;font-size:13px;font-weight:600;margin:0 0 6px;">With your G&A account you can:</p>
        <ul style="margin:0;padding-left:18px;color:#4b5563;font-size:13px;line-height:1.7;">
          <li>Save delivery details for faster checkout.</li>
          <li>Keep track of orders and view your history.</li>
          <li>Create wishlists and stay updated on new drops.</li>
        </ul>
      </div>

      <div style="margin:22px 0 10px;text-align:left;">
        <a href="${FRONTEND_URL}"
           style="display:inline-block;background:#111827;color:#ffffff;padding:11px 26px;text-decoration:none;border-radius:999px;font-weight:600;font-size:14px;box-shadow:0 12px 24px rgba(15,23,42,0.45);">
          Explore the store
        </a>
      </div>

      <p style="color:#6b7280;font-size:12px;line-height:1.6;margin:12px 0 0;">
        If you did not create this account, you can safely ignore this email. No further action is required.
      </p>
    </div>

    <div style="background:#f9fafb;padding:16px 20px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;">
      <div style="margin-bottom:4px;">© ${new Date().getFullYear()} G&A Ecommerce. All rights reserved.</div>
      <div style="margin-bottom:2px;">You are receiving this email because an account was created using this address.</div>
      <div>If this wasn’t you, you can ignore and delete this email.</div>
    </div>

  </div>
</div>
      `,
    });

    console.log("Welcome email sent");
  } catch (error) {
    console.error("Brevo email error:", error);
  }
};

const sendVerificationCode = async (email, otp) => {
  try {
    await emailApi.sendTransacEmail({
      sender: { email: process.env.SENDER_EMAIL },
      to: [{ email }],
      subject: "Verify your email - G&A Ecommerce",
      htmlContent: `
<div style="margin:0;padding:40px 0;background:#f3f4f6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.18);border:1px solid #e5e7eb;">

    <div style="background:#111827;color:#f9fafb;text-align:center;padding:22px 20px;border-bottom:1px solid rgba(148,163,184,0.35);">
      <div style="font-size:22px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">G&A Ecommerce</div>
      <div style="font-size:13px;opacity:0.8;margin-top:4px;">Secure email verification</div>
    </div>

    <div style="padding:30px 28px 24px;text-align:left;">
      <p style="font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 10px;">Action required</p>

      <h1 style="color:#0f172a;font-size:20px;margin:0 0 14px;line-height:1.4;">
        Confirm your email address
      </h1>

      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 14px;">
        To finish setting up your G&A Ecommerce account, please enter the verification code below
        in the app.
      </p>

      <div style="margin:20px 0 10px;text-align:center;">
        <span style="display:inline-block;font-size:26px;letter-spacing:0.55em;font-weight:700;background:#111827;color:#ffffff;padding:12px 30px;border-radius:999px;box-shadow:0 14px 30px rgba(15,23,42,0.45);">
          ${otp}
        </span>
      </div>

      <p style="color:#6b7280;font-size:12px;line-height:1.7;margin:10px 0 6px;text-align:center;">
        This code is valid for the next <strong>5 minutes</strong>. For your security, do not share it with anyone.
      </p>

      <div style="margin:18px 0 10px;">
        <p style="color:#4b5563;font-size:13px;font-weight:600;margin:0 0 6px;">How to verify</p>
        <ol style="margin:0;padding-left:18px;color:#4b5563;font-size:13px;line-height:1.7;">
          <li>Open the G&A Ecommerce website or app and sign in.</li>
          <li>Go to the <strong>My Account</strong> section.</li>
          <li>Enter this 6-digit code in the email verification form.</li>
        </ol>
      </div>

      <p style="color:#6b7280;font-size:12px;line-height:1.7;margin:8px 0 0;">
        If you did not request this verification, you can safely ignore this email and your account
        will remain unchanged.
      </p>
    </div>

    <div style="background:#f9fafb;padding:16px 20px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;">
      <div style="margin-bottom:4px;">© ${new Date().getFullYear()} G&A Ecommerce. All rights reserved.</div>
      <div style="margin-bottom:2px;">This security email was sent to ${email}.</div>
      <div>If this wasn’t you, you can ignore and delete this email.</div>
    </div>

  </div>
</div>
      `,
    });

    console.log("Verification email sent");
  } catch (error) {
    console.error("Brevo verification email error:", error);
  }
};

const sendPasswordResetCode = async (email, otp) => {
  try {
    await emailApi.sendTransacEmail({
      sender: { email: process.env.SENDER_EMAIL },
      to: [{ email }],
      subject: "Reset your password - G&A Ecommerce",
      htmlContent: `
<div style="margin:0;padding:40px 0;background:#f3f4f6;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.18);border:1px solid #e5e7eb;">

    <div style="background:#111827;color:#f9fafb;text-align:center;padding:22px 20px;border-bottom:1px solid rgba(148,163,184,0.35);">
      <div style="font-size:22px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">G&A Ecommerce</div>
      <div style="font-size:13px;opacity:0.8;margin-top:4px;">Secure password reset</div>
    </div>

    <div style="padding:30px 28px 24px;text-align:left;">
      <p style="font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.18em;margin:0 0 10px;">Security code</p>

      <h1 style="color:#0f172a;font-size:20px;margin:0 0 14px;line-height:1.4;">
        Reset your G&A password
      </h1>

      <p style="color:#4b5563;font-size:14px;line-height:1.7;margin:0 0 14px;">
        We received a request to reset the password for your G&A Ecommerce account.
        Use the verification code below to continue.
      </p>

      <div style="margin:20px 0 10px;text-align:center;">
        <span style="display:inline-block;font-size:26px;letter-spacing:0.55em;font-weight:700;background:#111827;color:#ffffff;padding:12px 30px;border-radius:999px;box-shadow:0 14px 30px rgba(15,23,42,0.45);">
          ${otp}
        </span>
      </div>

      <p style="color:#6b7280;font-size:12px;line-height:1.7;margin:10px 0 6px;text-align:center;">
        This code is valid for the next <strong>5 minutes</strong>. Do not share it with anyone.
      </p>

      <div style="margin:18px 0 10px;">
        <p style="color:#4b5563;font-size:13px;font-weight:600;margin:0 0 6px;">Next steps</p>
        <ol style="margin:0;padding-left:18px;color:#4b5563;font-size:13px;line-height:1.7;">
          <li>Return to the G&A Ecommerce website.</li>
          <li>Enter this 6-digit code on the password reset screen.</li>
          <li>Choose a new, strong password and save the changes.</li>
        </ol>
      </div>

      <p style="color:#6b7280;font-size:12px;line-height:1.7;margin:8px 0 0;">
        If you did not request a password reset, you can safely ignore this email and your password
        will remain unchanged.
      </p>
    </div>

    <div style="background:#f9fafb;padding:16px 20px;text-align:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;">
      <div style="margin-bottom:4px;">© ${new Date().getFullYear()} G&A Ecommerce. All rights reserved.</div>
      <div style="margin-bottom:2px;">This security email was sent to ${email}.</div>
      <div>If this wasn’t you, we recommend changing your password from your account settings.</div>
    </div>

  </div>
</div>
      `,
    });

    console.log("Password reset email sent");
  } catch (error) {
    console.error("Brevo password reset email error:", error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationCode,
  sendPasswordResetCode,
};