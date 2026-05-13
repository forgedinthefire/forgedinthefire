import { ORG } from '@/lib/constants';

export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: ORG.name,
    description: ORG.description,
    url: 'https://forgedinthefireohio.org',
    logo: 'https://forgedinthefireohio.org/forged-logo.png',
    email: ORG.email,
    telephone: ORG.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '15728 Lorain Ave, Unit 146',
      addressLocality: 'Cleveland',
      addressRegion: 'OH',
      postalCode: '44111-5542',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Cleveland, Ohio and Northeast Ohio',
      containsPlace: [
        { '@type': 'City', name: 'Cleveland' },
        { '@type': 'AdministrativeArea', name: 'Cuyahoga County' },
        { '@type': 'AdministrativeArea', name: 'Northeast Ohio' },
        { '@type': 'State', name: 'Ohio' },
      ],
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: ORG.phone,
      email: ORG.email,
      contactType: 'Victim Advocacy and Support',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://facebook.com/forgedinthefireohio',
      'https://instagram.com/forgedinthefireohio',
      'https://twitter.com/forgedinthefireohio',
      'https://linkedin.com/company/forgedinthefireohio',
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
    url: 'https://forgedinthefireohio.org',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://forgedinthefireohio.org/search?q={search_term_string}',
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

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://forgedinthefireohio.org${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
}

export function ServiceStructuredData({ name, description, url }: ServiceSchemaProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `https://forgedinthefireohio.org${url}`,
    provider: {
      '@type': 'NGO',
      name: ORG.name,
      url: 'https://forgedinthefireohio.org',
    },
    areaServed: {
      '@type': 'Place',
      name: 'Cleveland, Ohio and Northeast Ohio',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
