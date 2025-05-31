import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendLowStockAlert = async (
  goodName: string,
  quantity: number
) => {
  await transporter.sendMail({
    from: '"GoodTrack System" <system@goodtrack.com>',
    to: process.env.ADMIN_EMAIL,
    subject: 'Low Stock Alert',
    html: `
      <h2>Low Stock Alert</h2>
      <p>The following item is running low on stock:</p>
      <ul>
        <li><strong>Item:</strong> ${goodName}</li>
        <li><strong>Current Quantity:</strong> ${quantity}</li>
      </ul>
      <p>Please review and restock if necessary.</p>
    `,
  });
};