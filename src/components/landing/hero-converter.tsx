"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeftRight, Download, Copy, Check } from "lucide-react";
import { convertForward, convertBackward, detectFormat } from "@/lib/converter";

const SAMPLE_MARKDOWN = `# Hello World

This is **bold** and *italic* text.

## Features

- Item 1
- Item 2
- Item 3

\`\`\`js
console.log('hello');
\`\`\`

> A blockquote here

[Link text](https://example.com)`;

const SAMPLE_HTML = `<h1>Hello World</h1>
<p>This is <strong>bold</strong> and <em>italic</em> text.</p>
<h2>Features</h2>
<ul>
<li>Item 1</li>
<li>Item 2</li>
<li>Item 3</li>
</ul>
<pre><code class="language-js">console.log('hello');
</code></pre>
<blockquote>
<p>A blockquote here</p>
</blockquote>
<p><a href="https://example.com">Link text</a></p>`;

export function HeroConverter() {
  const [input, setInput] = useState(SAMPLE_MARKDOWN);
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"md_to_html" | "html_to_md">("md_to_html");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    try {
      if (direction === "md_to_html") {
        setOutput(convertForward(input));
      } else {
        setOutput(convertBackward(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
      setOutput("");
    }
  };

  const swap = () => {
    if (direction === "md_to_html") {
      setDirection("html_to_md");
      setInput(SAMPLE_HTML);
    } else {
      setDirection("md_to_html");
      setInput(SAMPLE_MARKDOWN);
    }
    setOutput("");
    setError("");
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    if (!output) return;
    const ext = direction === "md_to_html" ? "csv" : "json";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Direction toggle */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <span className={`text-sm font-medium ${direction === "md_to_html" ? "text-primary" : "text-muted-foreground"}`}>
          MARKDOWN
        </span>
        <button
          onClick={swap}
          className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm hover:bg-border transition-colors"
        >
          <ArrowLeftRight className="h-4 w-4" />
          {direction === "md_to_html" ? "→ HTML" : "→ MARKDOWN"}
        </button>
        <span className={`text-sm font-medium ${direction === "html_to_md" ? "text-primary" : "text-muted-foreground"}`}>
          HTML
        </span>
      </div>

      {/* Converter panels */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {direction === "md_to_html" ? "MARKDOWN Input" : "HTML Input"}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 p-4 bg-transparent font-mono text-sm resize-none focus:outline-none"
            placeholder={direction === "md_to_html" ? "Paste your MARKDOWN here..." : "Paste your HTML here..."}
          />
        </div>

        {/* Output */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {direction === "md_to_html" ? "HTML Output" : "MARKDOWN Output"}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={copyOutput}
                disabled={!output}
                className="p-1.5 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                title="Copy"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={downloadOutput}
                disabled={!output}
                className="p-1.5 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                title="Download"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-4 bg-transparent font-mono text-sm resize-none focus:outline-none"
            placeholder="Converted output will appear here..."
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Convert button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={convert}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          Convert Now <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
