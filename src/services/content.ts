import { connectDB } from "@/lib/db/connect";
import { SiteSettings } from "@/models/SiteSettings";
import { Page } from "@/models/Page";
import { Service } from "@/models/Service";
import { GalleryCategory, GalleryItem } from "@/models/Gallery";
import { Testimonial } from "@/models/Testimonial";
import { FAQCategory, FAQ } from "@/models/FAQ";
import { TeamMember } from "@/models/TeamMember";
import { BlogPost } from "@/models/BlogPost";
import { Booking, Inquiry } from "@/models/Booking";
import { Product, PricingCard } from "@/models/Product";
import { serializeDoc } from "@/lib/db/serialize";
import type { PublishStatus } from "@/types";

export async function getSiteSettings() {
  await connectDB();
  const settings = await SiteSettings.findOneAndUpdate(
    { singletonKey: "main" },
    { $setOnInsert: { singletonKey: "main" } },
    { upsert: true, new: true, lean: true },
  );
  return JSON.parse(JSON.stringify(settings)) as Record<string, unknown>;
}

export async function getPublishedPage(slug: string) {
  await connectDB();
  const page = await Page.findOne({ slug, status: "published" }).lean();
  if (!page) return null;
  return JSON.parse(JSON.stringify(page)) as Record<string, unknown>;
}

export async function getPageBySlug(slug: string) {
  await connectDB();
  const page = await Page.findOne({ slug }).lean();
  if (!page) return null;
  return JSON.parse(JSON.stringify(page)) as Record<string, unknown>;
}

export async function getPublishedServices(filters?: {
  category?: string;
  search?: string;
  featured?: boolean;
}) {
  await connectDB();
  const query: Record<string, unknown> = {
    status: "published" as PublishStatus,
    isDeleted: { $ne: true },
  };
  if (filters?.category) query.category = filters.category;
  if (filters?.featured) query.featured = true;
  if (filters?.search) {
    query.$text = { $search: filters.search };
  }
  const services = await Service.find(query).sort({ order: 1, title: 1 }).lean();
  return services.map((s) => serializeDoc(s as never)!);
}

export async function getServiceBySlug(slug: string) {
  await connectDB();
  const service = await Service.findOne({
    slug,
    status: "published",
    isDeleted: { $ne: true },
  }).lean();
  return serializeDoc(service as never);
}

export async function getServiceCategories() {
  await connectDB();
  const categories = await Service.distinct("category", {
    status: "published",
    isDeleted: { $ne: true },
  });
  return categories.sort();
}

export async function getPublishedTestimonials(limit?: number) {
  await connectDB();
  let query = Testimonial.find({
    status: "published",
    isDeleted: { $ne: true },
  }).sort({ order: 1 });
  if (limit) query = query.limit(limit);
  const items = await query.lean();
  return items.map((t) => serializeDoc(t as never)!);
}

export async function getPublishedFAQs() {
  await connectDB();
  const categories = await FAQCategory.find({ isArchived: { $ne: true } })
    .sort({ order: 1 })
    .lean();
  const faqs = await FAQ.find({
    status: "published",
    isDeleted: { $ne: true },
  })
    .sort({ order: 1 })
    .lean();
  return {
    categories: categories.map((c) => serializeDoc(c as never)!),
    faqs: faqs.map((f) => serializeDoc(f as never)!),
  };
}

export async function getGalleryData() {
  await connectDB();
  const categories = await GalleryCategory.find({ isArchived: { $ne: true } })
    .sort({ order: 1 })
    .lean();
  const items = await GalleryItem.find({
    status: "published",
    isDeleted: { $ne: true },
  })
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return {
    categories: categories.map((c) => serializeDoc(c as never)!),
    items: items.map((i) => serializeDoc(i as never)!),
  };
}

export async function getPublishedTeam() {
  await connectDB();
  const members = await TeamMember.find({
    status: "published",
    isDeleted: { $ne: true },
  })
    .sort({ order: 1 })
    .lean();
  return members.map((m) => serializeDoc(m as never)!);
}

export async function getPublishedBlogPosts(options?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) {
  await connectDB();
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 9;
  const query: Record<string, unknown> = {
    status: "published",
    isDeleted: { $ne: true },
  };
  if (options?.search) query.$text = { $search: options.search };
  if (options?.category) query.categories = options.category;

  const [posts, total] = await Promise.all([
    BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(query),
  ]);

  return {
    posts: posts.map((p) => serializeDoc(p as never)!),
    total,
    pages: Math.ceil(total / limit),
    page,
  };
}

export async function getBlogPostBySlug(slug: string) {
  await connectDB();
  const post = await BlogPost.findOne({
    slug,
    status: "published",
    isDeleted: { $ne: true },
  }).lean();
  return serializeDoc(post as never);
}

export async function getPublishedProducts() {
  await connectDB();
  const products = await Product.find({
    status: "published",
    isDeleted: { $ne: true },
  })
    .sort({ order: 1 })
    .lean();
  return products.map((p) => serializeDoc(p as never)!);
}

export async function getProductBySlug(slug: string) {
  await connectDB();
  const product = await Product.findOne({
    slug,
    status: "published",
    isDeleted: { $ne: true },
  }).lean();
  return serializeDoc(product as never);
}

export async function getPricingCards() {
  await connectDB();
  const cards = await PricingCard.find({
    status: "published",
    isVisible: true,
    isDeleted: { $ne: true },
  })
    .sort({ order: 1 })
    .lean();
  return cards.map((c) => serializeDoc(c as never)!);
}

export async function getDashboardStats() {
  await connectDB();
  const [
    services,
    galleryItems,
    testimonials,
    faqs,
    posts,
    bookings,
    inquiries,
    unreadInquiries,
    newBookings,
  ] = await Promise.all([
    Service.countDocuments({ isDeleted: { $ne: true } }),
    GalleryItem.countDocuments({ isDeleted: { $ne: true } }),
    Testimonial.countDocuments({ isDeleted: { $ne: true } }),
    FAQ.countDocuments({ isDeleted: { $ne: true } }),
    BlogPost.countDocuments({ isDeleted: { $ne: true } }),
    Booking.countDocuments({ isDeleted: { $ne: true } }),
    Inquiry.countDocuments({ isDeleted: { $ne: true } }),
    Inquiry.countDocuments({ status: "new", isDeleted: { $ne: true } }),
    Booking.countDocuments({ status: "new", isDeleted: { $ne: true } }),
  ]);

  return {
    services,
    galleryItems,
    testimonials,
    faqs,
    posts,
    bookings,
    inquiries,
    unreadInquiries,
    newBookings,
  };
}
