import { Metadata } from 'next';
import { HomeContent } from '@/components/home-content';
import { ORG } from '@/lib/constants';
import { generateMetaTags } from '@/lib/utils';

export const metadata: Metadata = generateMetaTags({
  title: 'Home',
  description: ORG.description,
});

export default function HomePage() {
  return <HomeContent />;
}
