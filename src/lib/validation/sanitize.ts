import sanitizeHtml from "sanitize-html";

const allowedTags = [
  ...sanitizeHtml.defaults.allowedTags,
  "img",
  "figure",
  "figcaption",
  "video",
  "source",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "iframe",
];

const allowedAttributes = {
  ...sanitizeHtml.defaults.allowedAttributes,
  img: ["src", "alt", "title", "width", "height", "loading"],
  a: ["href", "name", "target", "rel", "title"],
  video: ["src", "controls", "width", "height"],
  source: ["src", "type"],
  iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
  "*": ["class", "id"],
};

export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
}

export function stripHtml(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
}
