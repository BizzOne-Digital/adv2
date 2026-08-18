import { cmsPageMetadata, CmsPageView } from "@/components/site/cms-page-view";

export async function generateMetadata() {
  return cmsPageMetadata("about");
}

export default function AboutPage() {
  return <CmsPageView slug="about" />;
}
