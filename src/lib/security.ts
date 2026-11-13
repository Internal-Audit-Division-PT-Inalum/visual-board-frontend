/**
 * Security and sanitization utilities for Visual Board Frontend:
 * - URL protocol validation (XSS / Open Redirect / javascript: mitigation)
 * - Strict DOMParser-based rich HTML allowlist sanitization (CWE-79 defense)
 */

const SAFE_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

const ALLOWED_HTML_TAGS = new Set([
	"p",
	"br",
	"strong",
	"b",
	"em",
	"i",
	"u",
	"s",
	"del",
	"ul",
	"ol",
	"li",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"blockquote",
	"code",
	"pre",
	"span",
	"div",
	"hr",
	"a",
	"table",
	"thead",
	"tbody",
	"tfoot",
	"tr",
	"th",
	"td",
	"img",
]);

const STRIP_SUBTREE_TAGS = new Set([
	"script",
	"style",
	"iframe",
	"object",
	"embed",
	"form",
	"input",
	"button",
	"textarea",
	"select",
	"option",
	"link",
	"meta",
	"base",
	"svg",
	"math",
	"template",
	"noscript",
]);

const GLOBAL_ALLOWED_ATTRS = new Set(["class", "title", "dir", "lang"]);

const TAG_ALLOWED_ATTRS: Record<string, Set<string>> = {
	a: new Set(["href", "target", "rel"]),
	img: new Set(["src", "alt", "width", "height"]),
	td: new Set(["colspan", "rowspan", "scope"]),
	th: new Set(["colspan", "rowspan", "scope"]),
};

function escapeHtml(raw: string): string {
	return raw
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#39;");
}

/**
 * Validates and sanitizes an external or internal URL.
 * Permits only safe protocols (`http:`, `https:`, `mailto:`, `tel:`) or relative paths.
 * Rejects `javascript:`, `vbscript:`, `data:`, protocol-relative (`//`), and control characters.
 */
export function sanitizeUrl(
	url: string | null | undefined,
	fallback = "",
): string {
	if (!url || typeof url !== "string") {
		return fallback;
	}

	const trimmed = url.trim();
	if (!trimmed) {
		return fallback;
	}

	for (let i = 0; i < trimmed.length; i++) {
		const code = trimmed.charCodeAt(i);
		if (code <= 31 || code === 127) {
			return fallback;
		}
	}

	if (trimmed.startsWith("//")) {
		return fallback;
	}

	if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
		return trimmed;
	}

	const compact = trimmed.replace(/\s+/g, "");
	const schemeMatch = compact.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
	if (schemeMatch) {
		const protocol = `${schemeMatch[1].toLowerCase()}:`;
		return SAFE_URL_PROTOCOLS.has(protocol) ? trimmed : fallback;
	}

	return trimmed;
}

function sanitizeNodeIntoFragment(
	sourceNode: Node,
	targetDocument: Document,
	targetParent: Node,
): void {
	if (sourceNode.nodeType === Node.TEXT_NODE) {
		targetParent.appendChild(
			targetDocument.createTextNode(sourceNode.textContent ?? ""),
		);
		return;
	}

	if (sourceNode.nodeType !== Node.ELEMENT_NODE) {
		return;
	}

	const sourceElement = sourceNode as Element;
	const tagName = sourceElement.tagName.toLowerCase();

	if (STRIP_SUBTREE_TAGS.has(tagName)) {
		return;
	}

	if (!ALLOWED_HTML_TAGS.has(tagName)) {
		for (const child of Array.from(sourceElement.childNodes)) {
			sanitizeNodeIntoFragment(child, targetDocument, targetParent);
		}
		return;
	}

	const cleanElement = targetDocument.createElement(tagName);
	const tagAttrs = TAG_ALLOWED_ATTRS[tagName];

	for (const attr of Array.from(sourceElement.attributes)) {
		const attrName = attr.name.toLowerCase();
		const isAllowed =
			GLOBAL_ALLOWED_ATTRS.has(attrName) || Boolean(tagAttrs?.has(attrName));
		if (!isAllowed) {
			continue;
		}

		if (attrName === "href" || attrName === "src") {
			const safeAttrUrl = sanitizeUrl(attr.value);
			if (safeAttrUrl) {
				cleanElement.setAttribute(attrName, safeAttrUrl);
			}
			continue;
		}

		cleanElement.setAttribute(attrName, attr.value);
	}

	if (tagName === "a" && cleanElement.hasAttribute("href")) {
		cleanElement.setAttribute("target", "_blank");
		cleanElement.setAttribute("rel", "noopener noreferrer");
	}

	if (tagName === "img" && !cleanElement.hasAttribute("src")) {
		return;
	}

	for (const child of Array.from(sourceElement.childNodes)) {
		sanitizeNodeIntoFragment(child, targetDocument, cleanElement);
	}

	targetParent.appendChild(cleanElement);
}

/**
 * Parses and sanitizes untrusted rich HTML into a safe DOM DocumentFragment
 * containing only allowlisted elements, attributes, and validated URLs.
 */
export function sanitizeRichHtmlToFragment(
	dirtyHtml: string | null | undefined,
	targetDocument: Document = document,
): DocumentFragment {
	const fragment = targetDocument.createDocumentFragment();
	if (!dirtyHtml || typeof dirtyHtml !== "string") {
		return fragment;
	}

	if (typeof DOMParser === "undefined") {
		fragment.appendChild(targetDocument.createTextNode(dirtyHtml));
		return fragment;
	}

	const parser = new DOMParser();
	const parsed = parser.parseFromString(dirtyHtml, "text/html");

	for (const child of Array.from(parsed.body.childNodes)) {
		sanitizeNodeIntoFragment(child, targetDocument, fragment);
	}

	return fragment;
}

/**
 * Sanitizes untrusted rich HTML into a clean HTML string using strict allowlisting.
 */
export function sanitizeRichHtml(dirtyHtml: string | null | undefined): string {
	if (!dirtyHtml || typeof dirtyHtml !== "string") {
		return "";
	}

	if (typeof document === "undefined" || typeof DOMParser === "undefined") {
		return escapeHtml(dirtyHtml);
	}

	const container = document.createElement("div");
	container.appendChild(sanitizeRichHtmlToFragment(dirtyHtml, document));
	return container.innerHTML;
}
