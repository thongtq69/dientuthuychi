import { notFound } from 'next/navigation';

import { CmsLandingPage } from '@/components/CmsLandingPage';
import { getStaticPageData } from '@/lib/api/content';

export default async function StoreSystemPage() {
  const page = await getStaticPageData('he-thong-cua-hang');

  if (!page) notFound();

  return <CmsLandingPage page={page} />;
}
