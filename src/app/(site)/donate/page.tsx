import { cmsPageMetadata, CmsPageView } from "@/components/site/cms-page-view";
export async function generateMetadata() { return cmsPageMetadata("donate"); }
export default function Page() { return <CmsPageView slug="donate" />; }
