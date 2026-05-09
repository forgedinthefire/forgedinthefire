import { ORG } from '@/lib/constants';

export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: ORG.name,
    description: ORG.description,
    url: 'https://forgedinthefire.com',
    logo: 'https://forgedinthefire.com/logo.png',
    email: ORG.email,
    telephone: ORG.phone,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    sameAs: [
      'https://facebook.com/forgedinthefire',
      'https://instagram.com/forgedinthefire',
      'https://twitter.com/forgedinthefire',
      'https://linkedin.com/company/forgedinthefire',
    ],
    nonprofitStatus: 'Nonprofit501c3',
    cause: [
      'Human Trafficking Support',
      'Survivor Services',
      'Trauma-Informed Care',
      'Victim Advocacy',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORG.name,
    url: 'https://forgedinthefire.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://forgedinthefire.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
