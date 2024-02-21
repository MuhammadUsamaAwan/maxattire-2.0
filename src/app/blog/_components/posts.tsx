import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

import { getPosts } from '~/lib/fetchers/post';
import { getFileUrl } from '~/lib/utils';
import { AspectRatio } from '~/components/ui/aspect-ratio';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { PlaceholderImage } from '~/components/placeholder-image';

export async function Posts() {
  const posts = await getPosts();

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {posts.map(post => (
        <Card className='overflow-hidden' key={post.id}>
          <CardHeader className='border-b p-0'>
            <Link href={`/blog/${post.slug}`}>
              <AspectRatio ratio={4 / 3}>
                {post.thumbnail ? (
                  <Image
                    src={getFileUrl(post.thumbnail)}
                    alt={post.title}
                    className='object-cover'
                    fill
                    sizes='(min-width: 1500px) 443px, (min-width: 1040px) calc(27.27vw + 39px), (min-width: 780px) calc(50vw - 34px), 93.04vw'
                  />
                ) : (
                  <PlaceholderImage className='rounded-none' asChild />
                )}
              </AspectRatio>
            </Link>
          </CardHeader>
          <CardContent className='space-y-1.5 p-4'>
            <CardTitle className='line-clamp-1'>{post.title}</CardTitle>
            <div className='flex flex-wrap gap-2'>
              {post.tags?.split(',').map(tag => (
                <Badge key={tag} variant='outline' className='font-medium'>
                  {tag}
                </Badge>
              ))}
            </div>
            <div className='text-sm text-muted-foreground'>
              {format(post.createdAt ? new Date(post.createdAt) : new Date(), 'dd MMM yy')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
