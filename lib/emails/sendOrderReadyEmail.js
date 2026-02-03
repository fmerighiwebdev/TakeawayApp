import nodemailer from "nodemailer";
import path from "path";
import { getTenantAssets, getTenantDetails, getTenantSMTPConfig, getTenantTheme } from "../tenantDetails";

export async function sendOrderReadyEmail({
  customerName,
  customerEmail,
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
        Il tuo ordine è pronto per essere ritirato! Ti aspettiamo presto.
      </p>

      <p style="font-size: 17px; line-height: 1.6; color: #444444; margin: 16px 0;">
        Grazie per aver ordinato tramite la nostra app di asporto!
      </p>

      <!-- Footer -->
      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px;" />
      <p style="font-size: 13px; color: #999999; text-align: center; margin: 0;">
        ${tenantDetails.name}<br/>
        Grazie per averci scelto!
      </p>
    </div>
  `;

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
    subject: `Il tuo ordine è pronto per il ritiro!`,
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
