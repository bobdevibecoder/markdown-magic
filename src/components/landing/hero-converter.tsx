"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeftRight, Download, Copy, Check, FileText, Code } from "lucide-react";
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
<pre><code class="language-js">console.log('hello');</code></pre>
<blockquote>A blockquote here</blockquote>
<p><a href="https://example.com">Link text</a></p>`;

export function HeroConverter() {
  const [input, setInput] = useState(SAMPLE_MARKDOWN);
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"md_to_html" | "html_to_md">("md_to_html");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const convert = () => {
    setError("");
    setConverting(true);
    setTimeout(() => {
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
      setConverting(false);
    }, 150);
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
    const ext = direction === "md_to_html" ? "html" : "md";
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Direction toggle */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <FileText className={`h-4 w-4 ${direction === "md_to_html" ? "text-primary" : ""}`} />
          <span className={direction === "md_to_html" ? "text-primary" : ""}>Markdown</span>
        </div>
        <button
          onClick={swap}
          className="group flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm hover:border-primary/50 transition-all duration-300"
        >
          <ArrowLeftRight className="h-4 w-4 group-hover:text-primary transition-colors" />
          <span className="group-hover:text-primary transition-colors">Swap</span>
        </button>
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Code className={`h-4 w-4 ${direction === "html_to_md" ? "text-primary" : ""}`} />
          <span className={direction === "html_to_md" ? "text-primary" : ""}>HTML</span>
        </div>
      </div>

      {/* Converter panels */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="card-glow rounded-2xl glass overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-2">
                {direction === "md_to_html" ? "markdown" : "html"} input
              </span>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-72 p-5 bg-transparent font-mono text-sm resize-none focus:outline-none text-foreground placeholder:text-muted-foreground/50"
            placeholder={direction === "md_to_html" ? "Paste your Markdown here..." : "Paste your HTML here..."}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="card-glow rounded-2xl glass overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider ml-2">
                {direction === "md_to_html" ? "html" : "markdown"} output
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={copyOutput}
                disabled={!output}
                className="p-2 rounded-lg hover:bg-muted disabled:opacity-20 transition-all"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
              </button>
              <button
                onClick={downloadOutput}
                disabled={!output}
                className="p-2 rounded-lg hover:bg-muted disabled:opacity-20 transition-all"
                title="Download file"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-72 p-5 bg-transparent font-mono text-sm resize-none focus:outline-none text-foreground placeholder:text-muted-foreground/30"
            placeholder="Converted output will appear here..."
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Convert button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={convert}
          disabled={converting}
          className="btn-glow flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-white hover:bg-primary-hover transition-all disabled:opacity-70"
        >
          {converting ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Converting...
            </>
          ) : (
            <>
              Convert Now <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
