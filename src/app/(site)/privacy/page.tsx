import { cmsPageMetadata, CmsPageView } from "@/components/site/cms-page-view";
export async function generateMetadata() { return cmsPageMetadata("privacy"); }
export default function Page() { return <CmsPageView slug="privacy" />; }
