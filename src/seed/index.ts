import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Types } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { hashPassword } from "@/lib/auth/session";
import { getEnv } from "@/lib/env";
import { slugify } from "@/lib/utils";
import {
  SiteSettings,
  User,
  Page,
  Service,
  FAQCategory,
  FAQ,
  Testimonial,
  GalleryCategory,
  GalleryItem,
  BlogPost,
  TeamMember,
  PricingCard,
  Event,
} from "@/models";
import { PAGE_DEFINITIONS } from "./pages-data";
import { TESTIMONIAL_SEEDS } from "./testimonials-data";
import { EVENT_SEEDS } from "./events-data";
import { LEADERSHIP_SEEDS, LEADERSHIP_SLUGS, LEGACY_TEAM_PLACEHOLDER_SLUGS } from "./leadership-data";
import type { MediaRef } from "@/types";
import { siteImagePath, siteImageRef } from "@/lib/media/site-assets";

const __filename = fileURLToPath(import.meta.url);

/** Load `.env.local` / `.env` so `npm run seed` picks up MONGODB_URI and admin creds. */
function loadEnvFiles() {
  const root = process.cwd();
  for (const name of [".env.local", ".env"]) {
    try {
      const filePath = path.join(root, name);
      const content = readFileSync(filePath, "utf8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    } catch {
      // optional file
    }
  }
}

loadEnvFiles();

function placeholderImage(index: number, alt: string): MediaRef {
  const pool = [2, 5, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60];
  const n = pool[(index - 1) % pool.length];
  return siteImageRef(n, alt);
}

type ServiceSeed = {
  title: string;
  category: string;
  shortDescription: string;
  overviewHtml: string;
  offerItems: { title: string; description: string }[];
  benefitsHtml: string;
  eligibilityHtml: string;
  processSteps: { title: string; description: string; order: number }[];
  featured?: boolean;
};

const SERVICE_SEEDS: ServiceSeed[] = [
  {
    title: "Newcomer Settlement & Orientation",
    category: "Newcomer Settlement",
    shortDescription:
      "Practical orientation for life in Canada — housing basics, transit, banking, and community connections.",
    overviewHtml:
      "<p>Starting fresh in a new country can feel overwhelming. Our settlement team helps newcomers understand everyday systems, connect with local resources, and build confidence in their first months in Ontario.</p>",
    offerItems: [
      { title: "Welcome sessions", description: "Group and one-to-one orientation conversations." },
      { title: "Resource navigation", description: "Guidance on housing, transit, healthcare access, and schools." },
      { title: "Community introductions", description: "Connections to peer groups and cultural communities." },
    ],
    benefitsHtml:
      "<p>Participants gain clearer next steps, reduced isolation, and trusted referrals — without guarantees about immigration outcomes.</p>",
    eligibilityHtml:
      "<p>Open to immigrants and newcomers in the Greater Toronto Area. Some sessions may prioritize recent arrivals — contact us for current availability.</p>",
    processSteps: [
      { title: "Intake", description: "Share your situation and immediate priorities.", order: 1 },
      { title: "Orientation plan", description: "We map workshops, referrals, and follow-ups.", order: 2 },
      { title: "Ongoing check-ins", description: "Adjust support as your needs evolve.", order: 3 },
    ],
    featured: true,
  },
  {
    title: "Language & Communication Support",
    category: "Language Support",
    shortDescription:
      "Conversation circles, communication coaching, and referrals to formal language programs.",
    overviewHtml:
      "<p>Clear communication opens doors. We offer practical language support and help you find accredited training suited to your goals.</p>",
    offerItems: [
      { title: "Conversation circles", description: "Friendly practice in everyday English." },
      { title: "Communication coaching", description: "Interviews, appointments, and workplace basics." },
      { title: "Program referrals", description: "Links to LINC and other formal language training." },
    ],
    benefitsHtml:
      "<p>Build confidence speaking, listening, and navigating daily interactions in your community.</p>",
    eligibilityHtml: "<p>Available to immigrants and family members seeking language support in Ontario.</p>",
    processSteps: [
      { title: "Assessment conversation", description: "Discuss your current level and goals.", order: 1 },
      { title: "Program match", description: "Join circles or receive referral options.", order: 2 },
      { title: "Progress reviews", description: "Celebrate milestones and adjust support.", order: 3 },
    ],
    featured: true,
  },
  {
    title: "Employment & Career Readiness",
    category: "Employment",
    shortDescription:
      "Résumé support, interview practice, credential guidance, and employer-connection referrals.",
    overviewHtml:
      "<p>We help newcomers prepare for the Canadian job market with practical tools and referrals — we do not guarantee employment outcomes.</p>",
    offerItems: [
      { title: "Résumé & cover letters", description: "Canadian-format documents tailored to your field." },
      { title: "Interview practice", description: "Mock sessions with constructive feedback." },
      { title: "Credential navigation", description: "Information on recognition pathways and referrals." },
    ],
    benefitsHtml:
      "<p>Stronger applications, clearer understanding of local hiring norms, and expanded professional networks.</p>",
    eligibilityHtml:
      "<p>Immigrants seeking employment or career transition support. Some workshops may focus on specific sectors.</p>",
    processSteps: [
      { title: "Career conversation", description: "Clarify goals, experience, and barriers.", order: 1 },
      { title: "Skills workshops", description: "Attend targeted sessions or coaching.", order: 2 },
      { title: "Referrals & follow-up", description: "Connect to partners and track progress.", order: 3 },
    ],
    featured: true,
  },
  {
    title: "Youth Empowerment & Mentorship",
    category: "Youth Empowerment",
    shortDescription:
      "Mentorship, leadership workshops, and safe spaces for immigrant youth to thrive.",
    overviewHtml:
      "<p>Young newcomers deserve spaces to explore identity, build skills, and lead. Our youth programs pair mentorship with creative, culturally responsive activities.</p>",
    offerItems: [
      { title: "Mentor matching", description: "Supportive relationships with trained mentors." },
      { title: "Leadership labs", description: "Workshops on advocacy, teamwork, and goal-setting." },
      { title: "Peer networks", description: "Social events and study groups." },
    ],
    benefitsHtml:
      "<p>Increased confidence, belonging, and pathways to education and community leadership.</p>",
    eligibilityHtml:
      "<p>Youth typically aged 13–29 from immigrant backgrounds. Parent/guardian consent where required.</p>",
    processSteps: [
      { title: "Youth intake", description: "Learn interests, strengths, and support needs.", order: 1 },
      { title: "Program placement", description: "Join mentorship or workshop streams.", order: 2 },
      { title: "Showcase & growth", description: "Celebrate achievements and plan next steps.", order: 3 },
    ],
  },
  {
    title: "Family Wellbeing",
    category: "Family Wellbeing",
    shortDescription:
      "Family-centred workshops on parenting in a new country, school systems, and intergenerational connection.",
    overviewHtml:
      "<p>Immigration affects entire families. We create space for parents, caregivers, and children to learn, connect, and access referrals together.</p>",
    offerItems: [
      { title: "Parenting workshops", description: "Navigating schools, discipline, and cultural identity." },
      { title: "Family activities", description: "Events that strengthen bonds across generations." },
      { title: "Referral coordination", description: "Links to counselling, food security, and housing supports." },
    ],
    benefitsHtml: "<p>Stronger family communication and practical tools for daily life in Canada.</p>",
    eligibilityHtml:
      "<p>Immigrant families and caregivers. Child-friendly sessions noted in event listings.</p>",
    processSteps: [
      { title: "Family intake", description: "Understand household needs and schedules.", order: 1 },
      { title: "Workshop enrollment", description: "Register for relevant sessions.", order: 2 },
      { title: "Resource follow-up", description: "Ongoing referrals as needs change.", order: 3 },
    ],
  },
  {
    title: "Seniors Support & Connection",
    category: "Seniors Support",
    shortDescription:
      "Social connection, wellness activities, and navigation support tailored to immigrant seniors.",
    overviewHtml:
      "<p>Older newcomers face unique isolation and access barriers. We foster friendship, dignity, and practical guidance for seniors and their families.</p>",
    offerItems: [
      { title: "Social gatherings", description: "Tea circles, cultural celebrations, and outings." },
      { title: "Wellness activities", description: "Gentle movement, arts, and health literacy." },
      { title: "Systems navigation", description: "Help understanding benefits, transit, and healthcare access." },
    ],
    benefitsHtml: "<p>Reduced loneliness, increased community participation, and informed access to services.</p>",
    eligibilityHtml: "<p>Immigrant seniors and their caregivers in the communities we serve.</p>",
    processSteps: [
      { title: "Welcome visit", description: "Learn preferences, mobility, and language needs.", order: 1 },
      { title: "Activity enrollment", description: "Join groups matched to interests.", order: 2 },
      { title: "Ongoing companionship", description: "Regular check-ins and seasonal programs.", order: 3 },
    ],
  },
  {
    title: "Mental Health & Wellness Referrals",
    category: "Mental Health Referrals",
    shortDescription:
      "Confidential conversations and referrals to culturally responsive mental health resources.",
    overviewHtml:
      "<p>We are not a crisis clinic or therapy provider. We listen, reduce stigma, and connect you to appropriate professional and community supports.</p>",
    offerItems: [
      { title: "Supportive listening", description: "Non-judgmental conversations with trained staff." },
      { title: "Resource mapping", description: "Referrals to counsellors, clinics, and peer supports." },
      { title: "Wellness workshops", description: "Stress management and resilience-building sessions." },
    ],
    benefitsHtml:
      "<p>Clearer pathways to professional help and reduced isolation during difficult transitions.</p>",
    eligibilityHtml:
      "<p>Anyone we serve who needs mental health information or referrals. <strong>In an emergency, call 911 or your local crisis line.</strong></p>",
    processSteps: [
      { title: "Private intake", description: "Share concerns in a confidential setting.", order: 1 },
      { title: "Referral plan", description: "Identify suitable services and waitlist options.", order: 2 },
      { title: "Follow-up", description: "Check whether connections were helpful.", order: 3 },
    ],
  },
  {
    title: "Sports, Recreation & Community Events",
    category: "Sports/Recreation",
    shortDescription:
      "Inclusive sports, recreation, and cultural events that build friendship and belonging.",
    overviewHtml:
      "<p>Movement and celebration break down barriers. Join soccer nights, walking groups, festivals, and seasonal gatherings open to diverse skill levels.</p>",
    offerItems: [
      { title: "Recreation leagues", description: "Low-barrier sports and fitness activities." },
      { title: "Community festivals", description: "Cultural celebrations and neighbourhood events." },
      { title: "Volunteer event teams", description: "Help plan and host gatherings." },
    ],
    benefitsHtml: "<p>Physical wellbeing, social networks, and joyful connection across cultures.</p>",
    eligibilityHtml:
      "<p>Open to community members unless an event note specifies age or registration limits.</p>",
    processSteps: [
      { title: "Event calendar", description: "Browse upcoming activities online or in person.", order: 1 },
      { title: "Registration", description: "Sign up where required; walk-ins when noted.", order: 2 },
      { title: "Participate & feedback", description: "Join in and suggest future events.", order: 3 },
    ],
  },
  {
    title: "Education & Skills Workshops",
    category: "Education Workshops",
    shortDescription:
      "Workshops on digital literacy, financial basics, civic knowledge, and lifelong learning.",
    overviewHtml:
      "<p>Practical learning builds independence. Our workshops cover topics newcomers ask about most — from online safety to budgeting and civic participation.</p>",
    offerItems: [
      { title: "Digital skills", description: "Email, job portals, and online services." },
      { title: "Financial literacy", description: "Banking, credit, and budgeting basics." },
      { title: "Civic education", description: "Rights, responsibilities, and community involvement." },
    ],
    benefitsHtml: "<p>Increased self-sufficiency and confidence managing daily life in Canada.</p>",
    eligibilityHtml:
      "<p>Workshops open to immigrants and community members; some sessions may have capacity limits.</p>",
    processSteps: [
      { title: "Workshop listing", description: "Choose topics aligned with your goals.", order: 1 },
      { title: "Register", description: "Reserve a seat or join the waitlist.", order: 2 },
      { title: "Apply & connect", description: "Use new skills and access follow-up resources.", order: 3 },
    ],
  },
  {
    title: "Advocacy, Equity & Civic Engagement",
    category: "Advocacy/Equity",
    shortDescription:
      "Community advocacy training, equity dialogues, and pathways to civic participation.",
    overviewHtml:
      "<p>We equip immigrants to shape policies and practices that affect their lives — through storytelling, coalition building, and respectful civic engagement.</p>",
    offerItems: [
      { title: "Advocacy training", description: "Learn how to speak with decision-makers." },
      { title: "Equity dialogues", description: "Facilitated conversations on inclusion and access." },
      { title: "Civic participation", description: "Voter education and community board readiness." },
    ],
    benefitsHtml:
      "<p>Amplified community voice and stronger partnerships for equitable change.</p>",
    eligibilityHtml:
      "<p>Immigrants, allies, and partner organizations committed to respectful, non-partisan engagement.</p>",
    processSteps: [
      { title: "Interest form", description: "Tell us about your advocacy goals.", order: 1 },
      { title: "Training series", description: "Join workshops and peer learning.", order: 2 },
      { title: "Collective action", description: "Participate in campaigns and community tables.", order: 3 },
    ],
  },
];

async function seedSiteSettings(adminId?: Types.ObjectId) {
  const existing = await SiteSettings.findOne({ singletonKey: "main" });
  if (existing) {
    console.log("  SiteSettings already exists — skipped");
    return existing._id;
  }

  await SiteSettings.create({
    singletonKey: "main",
    general: {
      organizationName: "Light for Immigrants",
      tagline: "Bringing light, guidance, and belonging to every immigrant in Canada.",
      shortDescription:
        "An Ontario not-for-profit supporting immigrants and Canadian communities through programs, services, and advocacy.",
    },
    branding: {
      logo: "/logo.png",
      logoDark: "/logo.png",
      favicon: "/favicon.ico",
    },
    contact: {
      primaryEmail: "info@immigrantslight.ca",
      phone: "+1 437 873 7675",
      address: "163 Queen St E, Toronto, ON M5A 1S1, Canada",
      emailLaunchWarning: "",
      officeHours: [{ label: "Monday – Friday", hours: "9:00 AM – 5:00 PM" }],
    },
    actions: {
      bookingUrl: "/booking",
      volunteerUrl: "/get-involved",
    },
    footer: {
      description:
        "Supporting immigrants and Canadian communities in Ontario with light, guidance, and belonging.",
      copyrightText: "© Light for Immigrants. All rights reserved.",
    },
    seo: {
      defaultTitleTemplate: "%s | Light for Immigrants",
      defaultDescription:
        "Light for Immigrants supports immigrants and Canadian communities in Ontario through programs, services, and advocacy.",
      organizationSchema: {
        name: "Light for Immigrants",
        logo: "/logo.png",
      },
    },
    ...(adminId ? { updatedBy: adminId } : {}),
  });

  console.log("  SiteSettings created");
}

async function seedAdminUser(): Promise<Types.ObjectId | undefined> {
  const { adminSeedEmail, adminSeedPassword } = getEnv();

  if (!adminSeedEmail || !adminSeedPassword) {
    console.log("  Admin user skipped — set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD");
    return undefined;
  }

  const email = adminSeedEmail.toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`  Admin user already exists (${email}) — skipped`);
    return existing._id;
  }

  const passwordHash = await hashPassword(adminSeedPassword);
  const user = await User.create({
    email,
    passwordHash,
    name: "Site Administrator",
    role: "admin",
    isActive: true,
  });

  console.log(`  Admin user created (${email})`);
  return user._id;
}

async function seedPages(adminId?: Types.ObjectId) {
  let created = 0;
  let skipped = 0;

  for (const def of PAGE_DEFINITIONS) {
    const exists = await Page.findOne({ slug: def.slug });
    if (exists) {
      skipped++;
      continue;
    }

    await Page.create({
      slug: def.slug,
      title: def.title,
      status: def.status,
      hero: def.hero,
      sections: def.sections,
      seo: def.seo,
      ...(adminId ? { createdBy: adminId, updatedBy: adminId } : {}),
    });
    created++;
  }

  console.log(`  Pages: ${created} created, ${skipped} already existed`);
}

async function seedServices(adminId?: Types.ObjectId) {
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < SERVICE_SEEDS.length; i++) {
    const data = SERVICE_SEEDS[i];
    const slug = slugify(data.title);
    const exists = await Service.findOne({ slug });
    if (exists) {
      await Service.updateOne(
        { _id: exists._id },
        {
          $set: {
            status: "published",
            isDeleted: false,
          },
        },
      );
      skipped++;
      continue;
    }

    const cardImage = placeholderImage(i + 1, `${data.title} program illustration`);
    const heroMedia = placeholderImage(i + 2, `${data.title} hero image`);

    await Service.create({
      title: data.title,
      slug,
      shortDescription: data.shortDescription,
      cardImage,
      category: data.category,
      featured: data.featured ?? false,
      order: i + 1,
      status: "published",
      hero: {
        eyebrow: data.category,
        heading: data.title,
        introduction: data.shortDescription,
        media: heroMedia,
      },
      overviewHtml: data.overviewHtml,
      offerItems: data.offerItems,
      benefitsHtml: data.benefitsHtml,
      eligibilityHtml: data.eligibilityHtml,
      processSteps: data.processSteps,
      detailSections: [
        {
          key: "overview",
          title: "Overview",
          bodyHtml: data.overviewHtml,
          media: [heroMedia],
          layout: "split",
          isVisible: true,
          order: 0,
        },
        {
          key: "offers",
          title: "What we offer",
          bodyHtml: `<ul>${data.offerItems.map((o) => `<li><strong>${o.title}</strong> — ${o.description}</li>`).join("")}</ul>`,
          media: [placeholderImage(i + 3, `${data.title} services`)],
          isVisible: true,
          order: 1,
        },
        {
          key: "benefits",
          title: "Benefits & outcomes",
          bodyHtml: data.benefitsHtml,
          media: [placeholderImage(i + 4, `${data.title} community impact`)],
          isVisible: true,
          order: 2,
        },
        {
          key: "eligibility",
          title: "Who this is for",
          bodyHtml: data.eligibilityHtml,
          media: [placeholderImage(i + 5, `${data.title} participants`)],
          isVisible: true,
          order: 3,
        },
        {
          key: "process",
          title: "What to expect",
          bodyHtml: `<ol>${data.processSteps.map((s) => `<li><strong>${s.title}</strong> — ${s.description}</li>`).join("")}</ol>`,
          media: [placeholderImage((i % 5) + 1, `${data.title} process`)],
          isVisible: true,
          order: 4,
        },
      ],
      cta: { label: "Book support", href: "/booking" },
      seo: {
        metaTitle: `${data.title} | Light for Immigrants`,
        metaDescription: data.shortDescription,
      },
      ...(adminId ? { createdBy: adminId, updatedBy: adminId } : {}),
    });
    created++;
  }

  console.log(`  Services: ${created} created, ${skipped} already existed`);
}

const FAQ_CATEGORY_SEEDS = [
  { name: "Getting Started", slug: "getting-started", order: 1 },
  { name: "Services & Programs", slug: "services-programs", order: 2 },
  { name: "Appointments & Contact", slug: "appointments-contact", order: 3 },
  { name: "Volunteering & Community", slug: "volunteering-community", order: 4 },
  { name: "Privacy & Limitations", slug: "privacy-limitations", order: 5 },
];

const FAQ_SEEDS = [
  {
    categorySlug: "getting-started",
    question: "Who can access Light for Immigrants programs?",
    answerHtml:
      "<p>Our programs primarily serve immigrants, newcomers, and their families in Ontario. Some activities welcome allies, volunteers, and partner organizations. Contact us to confirm eligibility for a specific program.</p>",
    featured: true,
    order: 1,
  },
  {
    categorySlug: "getting-started",
    question: "Do you provide immigration legal advice?",
    answerHtml:
      "<p>No. We provide general information, community programs, and referrals. For legal advice or representation, consult a licensed immigration lawyer or regulated consultant.</p>",
    featured: true,
    order: 2,
  },
  {
    categorySlug: "getting-started",
    question: "Is Light for Immigrants a registered charity?",
    answerHtml:
      "<p>We are an Ontario not-for-profit organization. We do not make unsupported claims about charitable registration status on this website. Official documentation is available from the organization upon request.</p>",
    order: 3,
  },
  {
    categorySlug: "services-programs",
    question: "How much do your services cost?",
    answerHtml:
      "<p>Many community programs are offered at no cost to participants thanks to grants and donations. Partner-funded workshops may vary — always ask when registering. We do not publish fixed dollar packages online.</p>",
    featured: true,
    order: 1,
  },
  {
    categorySlug: "services-programs",
    question: "Can you guarantee employment or immigration outcomes?",
    answerHtml:
      "<p>No. We offer preparation, referrals, and community support, but we cannot guarantee job offers, visa approvals, or similar outcomes.</p>",
    order: 2,
  },
  {
    categorySlug: "services-programs",
    question: "Do you offer language classes?",
    answerHtml:
      "<p>We host conversation circles and communication coaching, and we refer participants to accredited language training such as LINC where appropriate.</p>",
    order: 3,
  },
  {
    categorySlug: "services-programs",
    question: "How do I choose the right program?",
    answerHtml:
      '<p>Start with our <a href="/services">Services page</a>, filter by category, or <a href="/booking">book a conversation</a> so we can learn about your goals and suggest next steps.</p>',
    order: 4,
  },
  {
    categorySlug: "appointments-contact",
    question: "How do I book an appointment?",
    answerHtml:
      '<p>Submit a request through our <a href="/booking">Booking page</a>. This is not a guaranteed calendar — our team will contact you to confirm timing.</p>',
    featured: true,
    order: 1,
  },
  {
    categorySlug: "appointments-contact",
    question: "How quickly will you respond to my message?",
    answerHtml:
      "<p>We aim to respond within two business days. Urgent mental health or safety concerns should be directed to emergency services or a crisis line, not this contact form.</p>",
    order: 2,
  },
  {
    categorySlug: "appointments-contact",
    question: "What are your office hours?",
    answerHtml:
      "<p>Default hours are Monday – Friday, 9:00 AM – 5:00 PM. Current hours are always shown on the Contact page from Site Settings.</p>",
    order: 3,
  },
  {
    categorySlug: "volunteering-community",
    question: "How can I volunteer?",
    answerHtml:
      '<p>Visit <a href="/get-involved">Get Involved</a> to learn about volunteer, mentor, and partner paths, then contact us with your interests and availability.</p>',
    order: 1,
  },
  {
    categorySlug: "volunteering-community",
    question: "Can my organization partner with you?",
    answerHtml:
      '<p>Yes. We welcome partnerships with schools, faith communities, businesses, and other non-profits. Use the contact form with the topic "Partnership."</p>',
    order: 2,
  },
  {
    categorySlug: "privacy-limitations",
    question: "What should I do in a mental health emergency?",
    answerHtml:
      "<p>Light for Immigrants is not a crisis service. If you or someone else is in immediate danger, call <strong>911</strong>. For crisis support, contact your local distress centre or crisis line.</p>",
    featured: true,
    order: 1,
  },
  {
    categorySlug: "privacy-limitations",
    question: "How is my personal information used?",
    answerHtml:
      '<p>Information submitted through forms is used to respond to you and coordinate programs. See our <a href="/privacy">Privacy Policy</a> for details. We do not sell personal data.</p>',
    order: 2,
  },
];

async function seedFaqs(adminId?: Types.ObjectId) {
  const categoryIds = new Map<string, Types.ObjectId>();
  let categoriesCreated = 0;
  let faqsCreated = 0;
  let faqsSkipped = 0;

  for (const cat of FAQ_CATEGORY_SEEDS) {
    let doc = await FAQCategory.findOne({ slug: cat.slug });
    if (!doc) {
      doc = await FAQCategory.create(cat);
      categoriesCreated++;
    }
    categoryIds.set(cat.slug, doc._id);
  }

  for (const faq of FAQ_SEEDS) {
    const slug = slugify(faq.question);
    const exists = await FAQ.findOne({ slug });
    if (exists) {
      faqsSkipped++;
      continue;
    }

    const categoryId = categoryIds.get(faq.categorySlug);
    if (!categoryId) continue;

    await FAQ.create({
      categoryId,
      question: faq.question,
      answerHtml: faq.answerHtml,
      slug,
      featured: faq.featured ?? false,
      order: faq.order,
      status: "published",
      ...(adminId ? { createdBy: adminId, updatedBy: adminId } : {}),
    });
    faqsCreated++;
  }

  console.log(
    `  FAQ categories: ${categoriesCreated} created; FAQs: ${faqsCreated} created, ${faqsSkipped} already existed`,
  );
}

async function seedTestimonials(adminId?: Types.ObjectId) {
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < TESTIMONIAL_SEEDS.length; i++) {
    const data = TESTIMONIAL_SEEDS[i];
    const exists = await Testimonial.findOne({ personName: data.personName });
    if (exists) {
      skipped++;
      continue;
    }

    await Testimonial.create({
      personName: data.personName,
      role: data.role,
      quote: data.quote,
      avatar: siteImageRef(data.imageIndex, `${data.personName} — community member`),
      featured: data.featured ?? false,
      order: i + 1,
      status: "published",
      isSample: false,
      ...(adminId ? { createdBy: adminId, updatedBy: adminId } : {}),
    });
    created++;
  }

  console.log(`  Testimonials: ${created} created, ${skipped} already existed`);
}

const GALLERY_CATEGORY_SEEDS = [
  { name: "Community Events", slug: "community-events", order: 1 },
  { name: "Newcomer Welcome", slug: "newcomer-welcome", order: 2 },
  { name: "Youth Programs", slug: "youth-programs", order: 3 },
  { name: "Workshops", slug: "workshops", order: 4 },
  { name: "Volunteers", slug: "volunteers", order: 5 },
  { name: "Partnerships", slug: "partnerships", order: 6 },
];

const GALLERY_ITEM_SEEDS = [
  { categorySlug: "community-events", title: "Summer community picnic", caption: "Draft placeholder — replace with real event photo.", imageIndex: 1 },
  { categorySlug: "community-events", title: "Neighbourhood festival", caption: "Draft placeholder for festival coverage.", imageIndex: 2 },
  { categorySlug: "newcomer-welcome", title: "Welcome day orientation", caption: "Draft placeholder for welcome day.", imageIndex: 3 },
  { categorySlug: "newcomer-welcome", title: "Resource fair booth", caption: "Draft placeholder for resource fair.", imageIndex: 4 },
  { categorySlug: "youth-programs", title: "Youth leadership lab", caption: "Draft placeholder for youth workshop.", imageIndex: 5 },
  { categorySlug: "youth-programs", title: "Mentorship celebration", caption: "Draft placeholder for mentorship event.", imageIndex: 1 },
  { categorySlug: "workshops", title: "Employment readiness session", caption: "Draft placeholder for workshop.", imageIndex: 2 },
  { categorySlug: "workshops", title: "Digital skills class", caption: "Draft placeholder for classroom scene.", imageIndex: 3 },
  { categorySlug: "volunteers", title: "Volunteer appreciation", caption: "Draft placeholder for volunteer event.", imageIndex: 4 },
  { categorySlug: "partnerships", title: "Partner roundtable", caption: "Draft placeholder for partnership meeting.", imageIndex: 5 },
];

async function seedGallery(adminId?: Types.ObjectId) {
  const categoryIds = new Map<string, Types.ObjectId>();
  let categoriesCreated = 0;
  let itemsCreated = 0;
  let itemsSkipped = 0;

  for (const cat of GALLERY_CATEGORY_SEEDS) {
    let doc = await GalleryCategory.findOne({ slug: cat.slug });
    if (!doc) {
      doc = await GalleryCategory.create({
        ...cat,
        coverImage: placeholderImage(cat.order, `${cat.name} cover`),
        description: `Draft gallery category for ${cat.name.toLowerCase()}.`,
      });
      categoriesCreated++;
    }
    categoryIds.set(cat.slug, doc._id);
  }

  for (let i = 0; i < GALLERY_ITEM_SEEDS.length; i++) {
    const item = GALLERY_ITEM_SEEDS[i];
    const exists = await GalleryItem.findOne({ title: item.title, status: "draft" });
    if (exists) {
      itemsSkipped++;
      continue;
    }

    const categoryId = categoryIds.get(item.categorySlug);
    if (!categoryId) continue;

    await GalleryItem.create({
      categoryId,
      title: item.title,
      caption: item.caption,
      media: placeholderImage(item.imageIndex, item.title),
      order: i + 1,
      status: "draft",
      ...(adminId ? { createdBy: adminId, updatedBy: adminId } : {}),
    });
    itemsCreated++;
  }

  console.log(
    `  Gallery categories: ${categoriesCreated} created; items: ${itemsCreated} created, ${itemsSkipped} already existed`,
  );
}

const BLOG_SEEDS = [
  {
    title: "Welcome to Light for Immigrants — starter article",
    excerpt: "Draft starter post introducing our mission and inviting the community to connect.",
    categories: ["Announcements"],
    tags: ["welcome", "community"],
  },
  {
    title: "Five practical tips for your first month in Ontario",
    excerpt: "Draft guide covering transit, banking, and community resources — expand before publishing.",
    categories: ["Resources"],
    tags: ["settlement", "tips"],
  },
  {
    title: "Volunteer spotlight — template post",
    excerpt: "Draft template for featuring volunteers. Replace with approved names and photos.",
    categories: ["Community"],
    tags: ["volunteers"],
  },
  {
    title: "Upcoming workshops this season",
    excerpt: "Draft events roundup — update dates and locations in admin before publishing.",
    categories: ["Events"],
    tags: ["workshops", "events"],
  },
];

async function seedBlogPosts(adminId?: Types.ObjectId) {
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < BLOG_SEEDS.length; i++) {
    const post = BLOG_SEEDS[i];
    const slug = slugify(post.title);
    const exists = await BlogPost.findOne({ slug });
    if (exists) {
      skipped++;
      continue;
    }

    await BlogPost.create({
      title: post.title,
      slug,
      excerpt: post.excerpt,
      coverImage: placeholderImage(i + 1, post.title),
      author: "Light for Immigrants",
      categories: post.categories,
      tags: post.tags,
      contentHtml: `<p><em>Starter draft content — replace before publishing.</em></p><p>${post.excerpt}</p><p>Contact us to learn more about programs and events.</p>`,
      featured: i === 0,
      status: "draft",
      seo: {
        metaTitle: `${post.title} | Light for Immigrants`,
        metaDescription: post.excerpt,
      },
      ...(adminId ? { createdBy: adminId, updatedBy: adminId } : {}),
    });
    created++;
  }

  console.log(`  Blog posts: ${created} created, ${skipped} already existed`);
}

const TEAM_SEEDS = LEADERSHIP_SEEDS;

async function seedTeamMembers(adminId?: Types.ObjectId) {
  let created = 0;
  let updated = 0;

  await TeamMember.updateMany(
    { slug: { $in: LEGACY_TEAM_PLACEHOLDER_SLUGS } },
    { $set: { isDeleted: true, status: "archived" } },
  );

  await TeamMember.deleteMany({ slug: { $nin: LEADERSHIP_SLUGS } });

  for (const member of TEAM_SEEDS) {
    const exists = await TeamMember.findOne({ slug: member.slug });
    const payload = {
      name: member.name,
      role: member.role,
      shortBio: member.shortBio,
      fullBioHtml: `<p>${member.shortBio}</p>`,
      photo: member.photo,
      isLeadership: true,
      featured: true,
      order: member.order,
      status: "published" as const,
      isDeleted: false,
      ...(adminId ? { updatedBy: adminId } : {}),
    };

    if (exists) {
      await TeamMember.updateOne({ _id: exists._id }, { $set: payload });
      updated++;
      continue;
    }

    await TeamMember.create({
      slug: member.slug,
      ...payload,
      ...(adminId ? { createdBy: adminId } : {}),
    });
    created++;
  }

  console.log(`  Leadership team: ${created} created, ${updated} updated`);
}

const PRICING_CARD_SEEDS = [
  {
    title: "Community Programs",
    descriptionHtml:
      "<p>Workshops, orientation, and recreation activities for immigrants and families. Funding varies by program.</p>",
    features: ["Settlement support", "Language circles", "Youth & family activities", "Referrals to partners"],
  },
  {
    title: "Organizational Partnerships",
    descriptionHtml:
      "<p>Co-designed initiatives with schools, agencies, and businesses serving newcomers.</p>",
    features: ["Custom program design", "Staff training", "Event collaboration", "Impact reporting"],
  },
  {
    title: "Workshops",
    descriptionHtml:
      "<p>Topic-based sessions on employment, digital skills, wellbeing, and civic engagement.</p>",
    features: ["Flexible formats", "In-person or hybrid options", "Materials included where noted", "Follow-up resources"],
  },
  {
    title: "Event Support",
    descriptionHtml:
      "<p>Welcome days, cultural celebrations, and community festivals tailored to your audience.</p>",
    features: ["Planning support", "Volunteer coordination", "Outreach assistance", "Accessibility planning"],
  },
];

async function seedPricingCards(adminId?: Types.ObjectId) {
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < PRICING_CARD_SEEDS.length; i++) {
    const card = PRICING_CARD_SEEDS[i];
    const slug = slugify(card.title);
    const exists = await PricingCard.findOne({ slug });
    if (exists) {
      skipped++;
      continue;
    }

    await PricingCard.create({
      title: card.title,
      slug,
      descriptionHtml: card.descriptionHtml,
      features: card.features,
      ctaLabel: "Contact us",
      ctaHref: "/contact",
      order: i + 1,
      isVisible: true,
      status: "published",
      ...(adminId ? { createdBy: adminId, updatedBy: adminId } : {}),
    });
    created++;
  }

  console.log(`  Pricing cards: ${created} created, ${skipped} already existed`);
}

async function seedEvents(adminId?: Types.ObjectId) {
  let created = 0;
  let skipped = 0;

  for (const data of EVENT_SEEDS) {
    const exists = await Event.findOne({ slug: data.slug });
    if (exists) {
      await Event.updateOne(
        { _id: exists._id },
        {
          $set: {
            title: data.title,
            shortDescription: data.shortDescription,
            descriptionHtml: data.descriptionHtml,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : undefined,
            startTime: data.startTime,
            endTime: data.endTime,
            location: data.location,
            address: data.address,
            city: data.city ?? "Toronto",
            image: data.image,
            isFree: data.isFree ?? true,
            featured: data.featured ?? false,
            order: data.order,
            status: "published",
            isDeleted: false,
            ...(adminId ? { updatedBy: adminId } : {}),
          },
        },
      );
      skipped++;
      continue;
    }

    await Event.create({
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      descriptionHtml: data.descriptionHtml,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      address: data.address,
      city: data.city ?? "Toronto",
      province: "Ontario",
      image: data.image,
      isFree: data.isFree ?? true,
      featured: data.featured ?? false,
      order: data.order,
      status: "published",
      ...(adminId ? { createdBy: adminId, updatedBy: adminId } : {}),
    });
    created++;
  }

  console.log(`  Events: ${created} created, ${skipped} already existed`);
}

export async function seed(): Promise<void> {
  console.log("Connecting to MongoDB…");
  await connectDB();

  console.log("Seeding database…");

  const adminId = await seedAdminUser();
  await seedSiteSettings(adminId);
  await seedPages(adminId);
  await seedServices(adminId);
  await seedFaqs(adminId);
  await seedTestimonials(adminId);
  await seedGallery(adminId);
  await seedBlogPosts(adminId);
  await seedTeamMembers(adminId);
  await seedPricingCards(adminId);
  await seedEvents(adminId);

  console.log("\nCurrent database totals:");
  console.log(`  Pages: ${await Page.countDocuments()}`);
  console.log(`  Services: ${await Service.countDocuments()}`);
  console.log(`  Testimonials: ${await Testimonial.countDocuments()}`);
  console.log(`  FAQs: ${await FAQ.countDocuments()}`);
  console.log(`  Gallery items: ${await GalleryItem.countDocuments()}`);
  console.log(`  Blog posts: ${await BlogPost.countDocuments()}`);
  console.log(`  Team members: ${await TeamMember.countDocuments()}`);
  console.log(`  Events: ${await Event.countDocuments()}`);
  console.log(`  Users: ${await User.countDocuments()}`);

  console.log("\nSeed completed.");
}

const scriptPath = process.argv[1]?.replace(/\\/g, "/") ?? "";
const isDirectRun =
  scriptPath.endsWith("src/seed/index.ts") ||
  scriptPath.endsWith("src/seed/index.js") ||
  path.normalize(process.argv[1] ?? "") === path.normalize(__filename);

if (isDirectRun) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}
