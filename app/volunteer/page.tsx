import { Metadata } from 'next';
import { generateMetaTags } from '@/lib/utils';
import VolunteerPageContent from './page-content';

export const metadata: Metadata = generateMetaTags({
  title: 'Volunteer to Help Human Trafficking Survivors in Cleveland Ohio',
  description:
    'Volunteer with Forged in the Fire and help support human trafficking survivors in Cleveland and Northeast Ohio through advocacy, education, outreach, and mission support.',
});

export default function VolunteerPage() {
  return <VolunteerPageContent />;
}
