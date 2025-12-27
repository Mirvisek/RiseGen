import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.risegen.pl'; // Domena docelowa, warto później zaktualizować jeśli inna

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
