import { render } from '@react-email/render';
import { createTransport } from 'nodemailer';

import { env } from '~/env';
import { siteConfig } from '~/config/site';
import { OrderEmail, type OrderEmailProps } from '~/components/emails/order';

const transporter = createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

type SendOrderEmailProps = OrderEmailProps & {
  to: string;
};

export async function sendOrderEmail({ to, ...props }: SendOrderEmailProps) {
  const emailHtml = render(<OrderEmail {...props} />);
  await transporter.sendMail({
    from: {
      name: siteConfig.title,
      address: env.SMTP_USER,
    },
    to: 'underusama@gmail.com',
    subject: `Your ${siteConfig.title} order #${props.code} has been placed`,
    html: emailHtml,
  });
}
