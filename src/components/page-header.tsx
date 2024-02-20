import { cn } from '~/lib/utils';

type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> &
  React.PropsWithChildren & {
    title: string;
    description: string;
  };

export function PageHeader({ title, description, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn('mb-8 space-y-1', className)} {...props}>
      <h1 className='text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]'>{title}</h1>
      <p className='text-base text-muted-foreground sm:text-lg'>{description}</p>
    </div>
  );
}
