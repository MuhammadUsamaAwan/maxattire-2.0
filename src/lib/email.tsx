import { render } from '@react-email/render';
import { createTransport } from 'nodemailer';

import { siteConfig } from '~/config/site';
import { OrderEmail, type OrderEmailProps } from '~/components/emails/order';

// TODO: Replace with your own SMTP credentials

const transporter = createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    user: 'my_user',
    pass: 'my_password',
  },
});

type SendOrderEmailProps = OrderEmailProps & {
  to: string;
};

export async function sendOrderEmail({ to, ...props }: SendOrderEmailProps) {
  const emailHtml = render(<OrderEmail {...props} />);
  const options = {
    from: '',
    to,
    subject: `Your ${siteConfig.title} order #${props.code} has been placed`,
    html: emailHtml,
  };
  await transporter.sendMail(options);
}
