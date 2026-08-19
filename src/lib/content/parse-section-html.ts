function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function parseMetricItems(html?: string): { value: string; label: string }[] {
  if (!html?.trim()) return [];

  try {
    const parsed = JSON.parse(html) as { value: string; label: string }[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to HTML parsing
  }

  const items: { value: string; label: string }[] = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match = liRegex.exec(html);
  while (match) {
    const inner = match[1];
    const strongMatch = inner.match(/<strong[^>]*>([\s\S]*?)<\/strong>\s*(.*)/i);
    if (strongMatch) {
      items.push({
        value: stripHtml(strongMatch[1]),
        label: stripHtml(strongMatch[2]),
      });
    } else {
      const text = stripHtml(inner);
      if (text) items.push({ value: "", label: text });
    }
    match = liRegex.exec(html);
  }

  return items;
}

export function parseValueItems(html?: string): { title: string; description: string }[] {
  if (!html?.trim()) return [];

  try {
    const parsed = JSON.parse(html) as { title: string; description: string }[];
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to HTML parsing
  }

  const items: { title: string; description: string }[] = [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let match = liRegex.exec(html);
  while (match) {
    const inner = match[1];
    const strongMatch = inner.match(/<strong[^>]*>([\s\S]*?)<\/strong>\s*(.*)/i);
    if (strongMatch) {
      items.push({
        title: stripHtml(strongMatch[1]),
        description: stripHtml(strongMatch[2]).replace(/^—\s*/, ""),
      });
    } else {
      const text = stripHtml(inner);
      if (text) items.push({ title: text, description: "" });
    }
    match = liRegex.exec(html);
  }

  if (items.length) return items;

  return [{ title: "Our values", description: stripHtml(html) }];
}

export function parseNoteFromHtml(html?: string): string | undefined {
  if (!html?.trim()) return undefined;
  if (html.includes("<ul") || html.includes("<ol")) {
    const emMatch = html.match(/<p[^>]*>\s*<em>([\s\S]*?)<\/em>\s*<\/p>/i);
    if (emMatch) return stripHtml(emMatch[1]);
    return undefined;
  }
  const pMatch = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (pMatch) return stripHtml(pMatch[1]);
  return stripHtml(html);
}
