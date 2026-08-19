"use client";

import React from 'react';

export default function SeoJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: "Ambrocia's Restaurant",
    description:
      'Ambrocia\'s — Authentic Hyderabadi Dum Biryani, kebabs, tandoori and family bucket biryanis. Delivery and dine-in available in Chennai.',
    telephone: ['+919444254893', '+918220580524'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Near VIT College, Opp To Life Cell Company, Kelakottiyur',
      addressLocality: 'Chennai',
      postalCode: '600102',
      addressRegion: 'TN',
      addressCountry: 'IN',
    },
    url: 'https://example.com',
    sameAs: ['https://www.facebook.com/ambrociasrestaurant'],
    hasMenu: { '@type': 'Menu', 'name': "Ambrocia's Menu", 'url': 'https://example.com/#cuisine' },
    servesCuisine: ['Hyderabadi', 'Indian', 'Mughlai'],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
