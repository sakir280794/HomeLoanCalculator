import type { MetadataRoute } from 'next';

const base = 'https://financecalcindia.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { url: '/', priority: 1, freq: 'monthly' },
    { url: '/home-loan', priority: 0.95, freq: 'monthly' },
    { url: '/personal-loan', priority: 0.9, freq: 'monthly' },
    { url: '/car-loan', priority: 0.9, freq: 'monthly' },
    { url: '/bike-loan', priority: 0.85, freq: 'monthly' },
    { url: '/education-loan', priority: 0.85, freq: 'monthly' },
    { url: '/business-loan', priority: 0.85, freq: 'monthly' },
    { url: '/emi-calculator', priority: 0.9, freq: 'monthly' },
    { url: '/fd-calculator', priority: 0.85, freq: 'monthly' },
    { url: '/sip-calculator', priority: 0.85, freq: 'monthly' },
    { url: '/ppf-calculator', priority: 0.85, freq: 'monthly' },
    { url: '/lumpsum-calculator', priority: 0.8, freq: 'monthly' },
    { url: '/compound-interest', priority: 0.8, freq: 'monthly' },
    { url: '/simple-interest', priority: 0.8, freq: 'monthly' },
    { url: '/gst-calculator', priority: 0.85, freq: 'monthly' },
    { url: '/gratuity-calculator', priority: 0.8, freq: 'monthly' },
    { url: '/guide', priority: 0.7, freq: 'yearly' },
    { url: '/articles', priority: 0.75, freq: 'weekly' },
    { url: '/articles/emi-booster-vs-prepayment', priority: 0.7, freq: 'yearly' },
    { url: '/articles/how-part-payments-slash-home-loan-tenure', priority: 0.7, freq: 'yearly' },
    { url: '/articles/5-ways-to-reduce-home-loan-interest', priority: 0.7, freq: 'yearly' },
    { url: '/articles/sip-vs-fd-which-is-better', priority: 0.7, freq: 'yearly' },
    { url: '/articles/understanding-compound-interest-the-eighth-wonder', priority: 0.7, freq: 'yearly' },
    { url: '/tips', priority: 0.65, freq: 'yearly' },
  ] as const;

  return routes.map(r => ({
    url: `${base}${r.url}`,
    lastModified: new Date(),
    changeFrequency: r.freq as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority: r.priority,
  }));
}
