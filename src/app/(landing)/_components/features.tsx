import { Icons } from '~/components/icons';

const features: {
  icon: keyof typeof Icons;
  children: React.ReactNode;
}[] = [
  { icon: 'discount', children: 'Up to 50% Off; the larger the order, the bigger the discount' },
  { icon: 'celebration', children: 'Free decoration for your custom logo on all orders' },
  { icon: 'truck', children: 'Free shipping on US orders over RS.1,387,916.50 PKR' },
];

export function Features() {
  return (
    <section className='container py-10'>
      <div className='mx-auto flex flex-col gap-8 sm:flex-row xl:w-3/4'>
        {features.map((feature, index) => (
          <Feature key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}

type FeatureProps = {
  icon: keyof typeof Icons;
  children: React.ReactNode;
};

function Feature({ icon, children }: FeatureProps) {
  const Icon = Icons[icon];
  return (
    <div className='flex items-center gap-2'>
      <div className='grid size-16 shrink-0 place-content-center rounded-full bg-accent'>
        <Icon className='size-6' />
      </div>
      <p className='font-medium'>{children}</p>
    </div>
  );
}
