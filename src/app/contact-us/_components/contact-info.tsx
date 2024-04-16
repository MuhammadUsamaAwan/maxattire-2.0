import { Card, CardContent } from '~/components/ui/card';

export function ContactInfo() {
  return (
    <Card className='flex-1'>
      <CardContent className='p-0'>
        <div className='border-b p-4'>
          <h2 className='font-semibold'>Live Chat</h2>
          <p className='text-muted-foreground'>
            Chat online: click the chat bar in the lower right corner of our website at any time! This service operates
            Monday to Friday, 8:00am - 5:00pm CST.
          </p>
        </div>
        <div className='border-b p-4'>
          <h2 className='font-semibold'>Phone</h2>
          <p className='text-muted-foreground'>
            Call us toll free at 1-111-222-3333. Phones are answered 8 AM - 5 PM (CST), Monday to Friday.
          </p>
        </div>
        <div className='p-4'>
          <h2 className='font-semibold'>Address</h2>
          <p className='text-muted-foreground'>Contoso Ltd 215 E Tasman Dr Po Box 65502</p>
        </div>
      </CardContent>
    </Card>
  );
}
