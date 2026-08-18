"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type FAQItem = {
  _id?: string;
  question: string;
  answerHtml: string;
  slug?: string;
  categoryId?: string;
};

type FAQCategory = {
  _id?: string;
  name: string;
  slug?: string;
};

type FAQAccordionProps = {
  faqs: Array<Record<string, unknown>>;
  categories?: Array<Record<string, unknown>>;
  className?: string;
};

export function FAQAccordion({
  faqs,
  categories = [],
  className,
}: FAQAccordionProps) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const normalizedFaqs = faqs as FAQItem[];
  const normalizedCategories = categories as FAQCategory[];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return normalizedFaqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "all" || faq.categoryId === activeCategory;
      const matchesQuery =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answerHtml.replace(/<[^>]*>/g, "").toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [normalizedFaqs, query, activeCategory]);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className={className}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="text-muted pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            className="h-11 w-full rounded-full border border-border bg-clean-white pl-11 pr-4 text-sm outline-none transition focus:border-signal-red"
            aria-label="Search FAQs"
          />
        </div>
        {normalizedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                activeCategory === "all"
                  ? "bg-signal-red text-clean-white"
                  : "border border-border hover:border-signal-red",
              )}
            >
              All
            </button>
            {normalizedCategories.map((cat) => (
              <button
                key={String(cat._id)}
                type="button"
                onClick={() => setActiveCategory(String(cat._id))}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  activeCategory === String(cat._id)
                    ? "bg-signal-red text-clean-white"
                    : "border border-border hover:border-signal-red",
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted py-8 text-center">No questions match your search.</p>
      ) : (
        <div className="divide-y divide-border rounded-2xl border border-border bg-clean-white">
          {filtered.map((faq) => {
            const id = String(faq._id ?? faq.slug ?? faq.question);
            const isOpen = openId === id;
            const panelId = `faq-panel-${id}`;
            const buttonId = `faq-button-${id}`;

            return (
              <div key={id}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition hover:text-signal-red"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(id)}
                  >
                    <span className="font-display text-lg font-semibold">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "size-5 shrink-0 transition",
                        isOpen && "rotate-180 text-signal-red",
                      )}
                      aria-hidden
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={cn("overflow-hidden px-6 pb-5", !isOpen && "hidden")}
                >
                  <div
                    className="prose-lfi text-muted text-sm"
                    dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
