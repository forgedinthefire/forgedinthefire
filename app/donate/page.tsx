import { Metadata } from 'next';
import { generateMetaTags } from '@/lib/utils';
import DonatePageContent from './page-content';

export const metadata: Metadata = generateMetaTags({
  title: 'Support Human Trafficking Survivors in Cleveland Ohio',
  description:
    'Support Forged in the Fire and help provide survivor centered advocacy, resources, and support for human trafficking survivors in Cleveland and Northeast Ohio.',
});

export default function DonatePage() {
  return <DonatePageContent />;
}
