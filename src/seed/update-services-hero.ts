import { connectDB } from "@/lib/db/connect";
import { Page } from "@/models/Page";
import { Service } from "@/models/Service";
import {
  GALLERY_IMAGE_NUMBERS,
  siteImageRef,
} from "@/lib/media/site-assets";

function pickServiceImage(slot: number, alt: string) {
  const n = GALLERY_IMAGE_NUMBERS[slot % GALLERY_IMAGE_NUMBERS.length];
  return siteImageRef(n, alt);
}

/**
 * Syncs services page hero and all service card/detail images
 * from public/images (pic1, pic2.jpeg, …).
 */
async function updateServicesMedia() {
  await connectDB();

  const pageResult = await Page.updateOne(
    { slug: "services" },
    {
      $set: {
        "hero.backgroundImage": "",
        "hero.backgroundImageAlt": "",
      },
    },
  );
  console.log(`✓ Services page hero cleared (matched: ${pageResult.matchedCount})`);

  const services = await Service.find({ isDeleted: { $ne: true } })
    .sort({ order: 1, title: 1 })
    .lean();

  let updated = 0;
  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    const title = String(service.title);
    const baseSlot = i * 6;

    const cardImage = pickServiceImage(baseSlot, `${title} — community program`);
    const heroMedia = pickServiceImage(baseSlot + 1, `${title} at Light for Immigrants`);

    const existingHero = (service.hero as Record<string, unknown>) ?? {};
    const hero = {
      ...existingHero,
      media: heroMedia,
    };

    const detailSections = (
      (service.detailSections as unknown as Array<Record<string, unknown>>) ?? []
    ).map((section, sectionIdx) => {
      const sectionTitle = String(section.title ?? title);
      return {
        ...section,
        media: [
          pickServiceImage(
            baseSlot + 2 + sectionIdx,
            `${sectionTitle} — ${title}`,
          ),
        ],
      };
    });

    await Service.updateOne(
      { _id: service._id },
      {
        $set: {
          cardImage,
          hero,
          detailSections,
        },
      },
    );
    updated++;
    console.log(`  • ${title}`);
  }

  console.log(`✓ Updated images on ${updated} service(s)`);
}

updateServicesMedia()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
