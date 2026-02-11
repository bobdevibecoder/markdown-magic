import { marked } from "marked";
import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

// Configure turndown to preserve code block languages
turndownService.addRule("fencedCodeBlock", {
  filter: (node) => {
    return (
      node.nodeName === "PRE" &&
      node.firstChild?.nodeName === "CODE"
    );
  },
  replacement: (content, node) => {
    const codeNode = node.firstChild as HTMLElement;
    const language = codeNode?.getAttribute("class")?.replace("language-", "") || "";
    const code = content.replace(/\n$/, "");
    return "\n\n```" + language + "\n" + code + "\n```\n\n";
  },
});

/**
 * Convert Markdown to HTML
 */
export function convertForward(input: string): string {
  if (!input.trim()) {
    throw new Error("Input is empty");
  }

  try {
    const html = marked.parse(input, { async: false }) as string;
    return html.trim();
  } catch (error) {
    throw new Error(`Markdown parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Convert HTML to Markdown
 */
export function convertBackward(input: string): string {
  if (!input.trim()) {
    throw new Error("Input is empty");
  }

  try {
    const markdown = turndownService.turndown(input);
    return markdown.trim();
  } catch (error) {
    throw new Error(`HTML parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Detect whether input is Markdown or HTML
 */
export function detectFormat(input: string): "forward" | "backward" | "unknown" {
  if (!input.trim()) {
    return "unknown";
  }

  const trimmed = input.trim();

  // Check for HTML tags
  const hasHtmlTags = /<(\w+)[^>]*>[\s\S]*<\/\1>/.test(trimmed) ||
                      /<\w+[^>]*\/>/.test(trimmed);

  // Check for Markdown patterns
  const hasMarkdownPatterns = /^#{1,6}\s/m.test(trimmed) ||  // Headers
                               /^\*\s/m.test(trimmed) ||       // Bullet lists
                               /^-\s/m.test(trimmed) ||        // Dash lists
                               /^\*\*.*\*\*/m.test(trimmed) || // Bold
                               /^\*.*\*/m.test(trimmed) ||     // Italic
                               /^\[.*\]\(.*\)/m.test(trimmed) || // Links
                               /^```/m.test(trimmed);          // Code blocks

  if (hasHtmlTags && !hasMarkdownPatterns) {
    return "backward"; // Likely HTML -> convert to Markdown
  }

  if (hasMarkdownPatterns || !hasHtmlTags) {
    return "forward"; // Likely Markdown -> convert to HTML
  }

  return "unknown";
}
