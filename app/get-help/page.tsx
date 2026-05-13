import { Metadata } from 'next';
import { generateMetaTags } from '@/lib/utils';
import GetHelpPageContent from './page-content';

export const metadata: Metadata = generateMetaTags({
  title: 'Get Help for Human Trafficking in Cleveland Ohio',
  description:
    'Need help for human trafficking in Cleveland or Northeast Ohio? Find crisis hotlines, survivor resources, and victim advocacy support. If in immediate danger, call 911.',
});

export default function GetHelpPage() {
  return <GetHelpPageContent />;
}
