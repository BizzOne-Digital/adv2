import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";
import { PageEditor } from "@/components/admin/page-editor";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminPageEditPage({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const page = await Page.findOne({ slug }).lean();
  if (!page) notFound();

  return (
    <PageEditor
      page={JSON.parse(JSON.stringify(page))}
    />
  );
}
