import { Resend } from 'resend';

const resend = new Resend("re_TL1yftUm_AT1b8VmsJpC5XfqTiSgG4Ywe");

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // You can set a custom domain if verified
      to,
      subject,
      html,
    });

    console.log('Email sent:', data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default sendEmail
