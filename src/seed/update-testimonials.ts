import { connectDB } from "@/lib/db/connect";
import { Testimonial } from "@/models/Testimonial";
import { Page } from "@/models/Page";
import { siteImageRef } from "@/lib/media/site-assets";
import { TESTIMONIAL_SEEDS } from "./testimonials-data";

async function updateTestimonials() {
  await connectDB();

  const removed = await Testimonial.deleteMany({
    $or: [
      { isSample: true },
      { personName: { $regex: /^Sample Participant/i } },
    ],
  });
  console.log(`✓ Removed ${removed.deletedCount} placeholder testimonial(s)`);

  let upserted = 0;
  for (let i = 0; i < TESTIMONIAL_SEEDS.length; i++) {
    const data = TESTIMONIAL_SEEDS[i];
    await Testimonial.updateOne(
      { personName: data.personName },
      {
        $set: {
          personName: data.personName,
          role: data.role,
          quote: data.quote,
          avatar: siteImageRef(data.imageIndex, `${data.personName} — community member`),
          featured: data.featured ?? false,
          order: i + 1,
          status: "published",
          isSample: false,
          isDeleted: false,
        },
      },
      { upsert: true },
    );
    upserted++;
    console.log(`  • ${data.personName}`);
  }
  console.log(`✓ Synced ${upserted} testimonial(s)`);

  await Page.updateOne(
    { slug: "testimonials" },
    {
      $set: {
        "sections.$[intro].bodyHtml":
          "<p>These stories come from newcomers, families, youth, seniors, and volunteers who have walked alongside Light for Immigrants in Ontario. Each voice reflects a real journey toward confidence, connection, and belonging.</p>",
      },
    },
    {
      arrayFilters: [{ "intro.key": "testimonials-intro" }],
    },
  );
  console.log("✓ Testimonials page intro updated");
}

updateTestimonials()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
