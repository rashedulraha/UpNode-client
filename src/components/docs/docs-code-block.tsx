"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

export interface CodeSnippet {
	lang: string;
	label: string;
	code: string;
}

interface DocsCodeBlockProps {
	title?: string;
	snippets: CodeSnippet[] | string;
	defaultLang?: string;
	showLineNumbers?: boolean;
}

function highlightCode(code: string, lang: string): string {
	let escaped = code
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");

	if (lang === "bash" || lang === "shell" || lang === "curl") {
		escaped = escaped.replace(
			/(#.*)$/gm,
			'<span class="text-slate-500 dark:text-neutral-500">$1</span>',
		);
		escaped = escaped.replace(
			/"([^"]*)"/g,
			'<span class="text-emerald-600 dark:text-emerald-400">"$1"</span>',
		);
		escaped = escaped.replace(
			/(\$[A-Z_0-9]+)/g,
			'<span class="text-amber-600 dark:text-amber-300">$1</span>',
		);
		escaped = escaped.replace(
			/\b(curl|wget|npm|npx|node|python|pip|export|echo|cat)\b/g,
			'<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>',
		);
		escaped = escaped.replace(
			/(\s-{1,2}[\w-]+)/g,
			'<span class="text-indigo-600 dark:text-indigo-300">$1</span>',
		);
	} else if (lang === "json") {
		escaped = escaped.replace(
			/"([^"]+)":/g,
			'<span class="text-blue-600 dark:text-blue-400">"$1"</span>:',
		);
		escaped = escaped.replace(
			/: "([^"]*)"/g,
			': <span class="text-emerald-600 dark:text-emerald-400">"$1"</span>',
		);
		escaped = escaped.replace(
			/: (true|false|null|\d+)/g,
			': <span class="text-amber-600 dark:text-amber-300 font-semibold">$1</span>',
		);
	} else if (
		lang === "typescript" ||
		lang === "javascript" ||
		lang === "ts" ||
		lang === "js"
	) {
		escaped = escaped.replace(
			/\b(const|let|var|async|await|function|return|import|from|export|default|if|else|new|class|extends|this|typeof|interface|type)\b/g,
			'<span class="text-blue-600 dark:text-blue-400 font-semibold">$1</span>',
		);
		escaped = escaped.replace(
			/`([^`]*)`/g,
			'<span class="text-emerald-600 dark:text-emerald-400">`$1`</span>',
		);
		escaped = escaped.replace(
			/"([^"]*)"/g,
			'<span class="text-emerald-600 dark:text-emerald-400">"$1"</span>',
		);
		escaped = escaped.replace(
			/'([^']*)'/g,
			"<span class=\"text-emerald-600 dark:text-emerald-400\">'$1'</span>",
		);
		escaped = escaped.replace(
			/(\/\/.*)$/gm,
			'<span class="text-slate-500 dark:text-neutral-500">$1</span>',
		);
	} else if (lang === "python" || lang === "py") {
		escaped = escaped.replace(
			/\b(def|class|import|from|return|if|else|elif|try|except|with|as|async|await|None|True|False)\b/g,
			'<span class="text-purple-600 dark:text-purple-400 font-semibold">$1</span>',
		);
		escaped = escaped.replace(
			/"([^"]*)"/g,
			'<span class="text-emerald-600 dark:text-emerald-400">"$1"</span>',
		);
		escaped = escaped.replace(
			/'([^']*)'/g,
			"<span class=\"text-emerald-600 dark:text-emerald-400\">'$1'</span>",
		);
		escaped = escaped.replace(
			/(#.*)$/gm,
			'<span class="text-slate-500 dark:text-neutral-500">$1</span>',
		);
	} else if (lang === "go") {
		escaped = escaped.replace(
			/\b(package|import|func|type|struct|return|if|else|nil|err|var)\b/g,
			'<span class="text-cyan-600 dark:text-cyan-400 font-semibold">$1</span>',
		);
		escaped = escaped.replace(
			/"([^"]*)"/g,
			'<span class="text-emerald-600 dark:text-emerald-400">"$1"</span>',
		);
		escaped = escaped.replace(
			/(\/\/.*)$/gm,
			'<span class="text-slate-500 dark:text-neutral-500">$1</span>',
		);
	}

	return escaped;
}

export function DocsCodeBlock({
	title,
	snippets,
	defaultLang,
	showLineNumbers = false,
}: DocsCodeBlockProps) {
	const normalizedSnippets: CodeSnippet[] =
		typeof snippets === "string"
			? [
					{
						lang: defaultLang || "bash",
						label: defaultLang || "bash",
						code: snippets,
					},
				]
			: snippets;

	const [activeIndex, setActiveIndex] = useState(0);
	const [copied, setCopied] = useState(false);

	const currentSnippet =
		normalizedSnippets[activeIndex] || normalizedSnippets[0];

	const handleCopy = () => {
		if (!currentSnippet) return;
		navigator.clipboard.writeText(currentSnippet.code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	const lines = currentSnippet.code.split("\n");

	return (
		<div className="rounded-none overflow-hidden my-6 border border-neutral-800 bg-black text-slate-100 shadow-md">
			{/* Code Header / Tabs */}
			<div className="flex items-center justify-between px-4 py-2.5 bg-neutral-950 border-b border-neutral-850">
				<div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
					{/* Mac window dots (blocky terminal style) */}
					<div className="hidden sm:flex items-center gap-1 mr-2">
						<span className="w-2.5 h-2.5 rounded-none bg-rose-500/60" />
						<span className="w-2.5 h-2.5 rounded-none bg-amber-500/60" />
						<span className="w-2.5 h-2.5 rounded-none bg-emerald-500/60" />
					</div>

					{title && (
						<span className="font-mono text-[11px] font-bold text-neutral-400 border-r border-neutral-850 pr-3 flex items-center gap-1.5">
							<Terminal className="w-3.5 h-3.5 text-emerald-400" />
							{title}
						</span>
					)}

					{/* Language Switcher Tabs */}
					{normalizedSnippets.length > 1 ? (
						<div className="flex items-center gap-1.5">
							{normalizedSnippets.map((s, idx) => (
								<button
									key={s.label}
									onClick={() => setActiveIndex(idx)}
									className={`px-2.5 py-1 rounded-none font-mono text-[9px] tracking-wider uppercase transition-all cursor-pointer ${
										activeIndex === idx
											? "bg-neutral-900 text-emerald-450 border border-neutral-800 font-bold"
											: "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/30"
									}`}
								>
									[{s.label}]
								</button>
							))}
						</div>
					) : (
						<span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
							[{currentSnippet.lang}]
						</span>
					)}
				</div>

				{/* Copy button */}
				<button
					onClick={handleCopy}
					className="flex items-center gap-1 px-2.5 py-1 rounded-none bg-neutral-900 hover:bg-neutral-950 text-neutral-400 border border-neutral-800 font-mono text-[9px] transition-all cursor-pointer uppercase tracking-wider font-bold"
					title="Copy code"
				>
					{copied ? (
						<>
							<Check className="w-3 h-3 text-emerald-400" />
							<span className="text-emerald-400 font-semibold">Copied!</span>
						</>
					) : (
						<>
							<Copy className="w-3 h-3 opacity-70" />
							<span>Copy</span>
						</>
					)}
				</button>
			</div>

			{/* Code Body */}
			<div className="relative overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-relaxed text-slate-200">
				<pre className="flex">
					{showLineNumbers && (
						<div className="select-none pr-4 text-right text-slate-600 dark:text-neutral-600 border-r border-slate-800 dark:border-neutral-800 mr-4">
							{lines.map((_, i) => (
								<div key={i}>{i + 1}</div>
							))}
						</div>
					)}
					<code
						className="flex-1"
						dangerouslySetInnerHTML={{
							__html: highlightCode(currentSnippet.code, currentSnippet.lang),
						}}
					/>
				</pre>
			</div>
		</div>
	);
}

export default DocsCodeBlock;
