import { notFound } from 'next/navigation';

import { CmsLandingPage } from '@/components/CmsLandingPage';
import { getStaticPageData } from '@/lib/api/content';

export default async function TradeInPage() {
  const page = await getStaticPageData('thu-cu-doi-moi');

  if (!page) notFound();

  return <CmsLandingPage page={page} />;
}
