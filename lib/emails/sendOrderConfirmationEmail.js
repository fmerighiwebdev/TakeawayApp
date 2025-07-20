import nodemailer from "nodemailer";
import path from "path";
import { getTenantAssets, getTenantDetails, getTenantSMTPConfig, getTenantTheme } from "../tenantDetails";

export async function sendOrderConfirmationEmail({
  customerName,
  customerEmail,
  pickupTime,
  orderPublicId,
  tenantId,
}) {
  const tenantDetails = await getTenantDetails(tenantId);
  const tenantTheme = await getTenantTheme(tenantId);
  const tenantAssets = await getTenantAssets(tenantId);
  const tenantSMTPConfig = await getTenantSMTPConfig(tenantId);

  const html = `
    <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #eee;">
      <!-- Logo Section -->
      <div style="text-align: center; padding-bottom: 20px;">
        <img src="cid:${tenantAssets.cidName}" alt="${tenantDetails.name} - Logo" style="max-width: 100px; height: auto;" />
      </div>

      <!-- Greeting -->
      <h2 style="color: ${tenantTheme.primaryColor}; font-size: 24px; margin-top: 0;">Ciao ${customerName},</h2>
      
      <!-- Message -->
      <p style="font-size: 17px; line-height: 1.6; color: #444444; margin: 16px 0;">
        Grazie per aver ordinato tramite la nostra app di asporto! Abbiamo ricevuto il tuo ordine e lo stiamo preparando con cura.
      </p>

      <p style="font-size: 17px; line-height: 1.6; color: #444444; margin: 16px 0;">
        Ti aspettiamo all'orario da te indicato:
      </p>

      <!-- Time Highlight -->
      <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; padding: 20px; margin: 24px 0; text-align: center; border-radius: 6px;">
        <p style="font-size: 30px; margin: 0; color: #333333;"><strong>${pickupTime}</strong></p>
      </div>

      <p style="font-size: 16px; text-align: center; color: #666;">Puoi vedere un riepilogo del tuo ordine qui:</p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://${tenantDetails.domain}/checkout/success/${orderPublicId}" style="padding: 12px 24px; background-color: ${tenantTheme.secondaryColor}; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Riepilogo ordine</a>
      </div>

      <!-- Footer -->
      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px;" />
      <p style="font-size: 13px; color: #999999; text-align: center; margin: 0;">
        ${tenantDetails.name}<br/>
        Grazie per averci scelto!
      </p>
    </div>
  `;

  console.log("SMTP Config:", tenantSMTPConfig);

  const transporter = nodemailer.createTransport({
    host: tenantSMTPConfig.smtpServer,
    port: tenantSMTPConfig.smtpPort,
    secure: false,
    auth: {
      user: tenantSMTPConfig.smtpUsername,
      pass: tenantSMTPConfig.smtpPass,
    },
  });

  await transporter.sendMail({
    from: `"${tenantDetails.name} | Takeaway" <${tenantSMTPConfig.smtpSender}>`,
    to: customerEmail,
    subject: `Conferma Ordine | ${tenantDetails.name} | Takeaway`,
    html,
    attachments: [
      {
        filename: `${tenantAssets.cidName}.png`,
        path: tenantAssets.cidUrl,
        cid: tenantAssets.cidName,
      },
    ],
  });
}
