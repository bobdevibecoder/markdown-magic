declare module "turndown" {
  interface TurndownOptions {
    headingStyle?: "setext" | "atx";
    bulletListMarker?: "*" | "-" | "+";
    codeBlockStyle?: "indented" | "fenced";
    fence?: "```" | "~~~";
    strongDelimiter?: "**" | "__";
    emDelimiter?: "_" | "*";
  }

  interface Rule {
    filter: string | string[] | ((node: HTMLElement) => boolean);
    replacement: (content: string, node: HTMLElement, options: TurndownOptions) => string;
  }

  class TurndownService {
    constructor(options?: TurndownOptions);
    addRule(key: string, rule: Rule): this;
    turndown(html: string): string;
    use(plugins: Array<(service: TurndownService) => void>): this;
  }

  export = TurndownService;
}
