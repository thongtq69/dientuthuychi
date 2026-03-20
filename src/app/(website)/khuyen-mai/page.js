import { notFound } from 'next/navigation';

import { CmsLandingPage } from '@/components/CmsLandingPage';
import { getPromotionLandingData } from '@/lib/api/content';

export default async function PromotionPage() {
  const page = await getPromotionLandingData();

  if (!page) notFound();

  return <CmsLandingPage page={page} />;
}
