import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

export async function sendOrderConfirmationEmail({
  customerName,
  customerEmail,
  pickupTime,
  orderId,
}) {
  const html = `
    <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #eee;">
      <!-- Logo Section -->
      <div style="text-align: center; padding-bottom: 20px;">
        <img src="cid:chandi-logo" alt="Ristorante Pizzeria All'Amicizia" style="max-width: 100px; height: auto;" />
      </div>

      <!-- Greeting -->
      <h2 style="color: #e07a10; font-size: 24px; margin-top: 0;">Ciao ${customerName},</h2>
      
      <!-- Message -->
      <p style="font-size: 17px; line-height: 1.6; color: #444444; margin: 16px 0;">
        Grazie per aver ordinato tramite la nostra app di asporto! Abbiamo ricevuto il tuo ordine e lo stiamo preparando con cura.
      </p>

      <p style="font-size: 17px; line-height: 1.6; color: #444444; margin: 16px 0;">
        Ti aspettiamo al nostro ristorante all'orario da te indicato:
      </p>

      <!-- Time Highlight -->
      <div style="background-color: #f9f9f9; border: 1px solid #e0e0e0; padding: 20px; margin: 24px 0; text-align: center; border-radius: 6px;">
        <p style="font-size: 30px; margin: 0; color: #333333;"><strong>${pickupTime}</strong></p>
      </div>

      <p style="font-size: 16px; text-align: center; color: #666;">Puoi vedere un riepilogo del tuo ordine qui:</p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.BASE_URL}/checkout/success/${orderId}" style="padding: 12px 24px; background-color: #e07a10; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Riepilogo ordine</a>
      </div>

      <!-- Footer -->
      <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px;" />
      <p style="font-size: 13px; color: #999999; text-align: center; margin: 0;">
        Ristorante Pizzeria All'Amicizia<br/>
        Grazie per averci scelto!
      </p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Ristorante Pizzeria All'Amicizia - Takeaway" <${process.env.SENDER_EMAIL}>`,
    to: customerEmail,
    subject: "Conferma Ordine - All'Amicizia Takeaway",
    html,
    attachments: [
      {
        filename: "chandi-logo.png",
        path: path.join(process.cwd(), "public", "chandi-logo.png"),
        cid: "chandi-logo",
      },
    ],
  });
}
