import { cmsPageMetadata, CmsPageView } from "@/components/site/cms-page-view";
export async function generateMetadata() { return cmsPageMetadata("get-involved"); }
export default function Page() { return <CmsPageView slug="get-involved" />; }
