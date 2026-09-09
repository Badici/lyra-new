import type { ReactNode } from "react";
import { mediaUrl } from "@/lib/media-url";

type TipTapNode = {
  type?: string;
  text?: string;
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
};

function renderMarks(text: string, marks?: TipTapNode["marks"]): ReactNode {
  if (!marks?.length) return text;
  return marks.reduce<ReactNode>((acc, mark) => {
    if (mark.type === "bold") return <strong key={`${mark.type}-${text}`}>{acc}</strong>;
    if (mark.type === "italic") return <em key={`${mark.type}-${text}`}>{acc}</em>;
    if (mark.type === "code") return <code key={`${mark.type}-${text}`}>{acc}</code>;
    if (mark.type === "link" && typeof mark.attrs?.href === "string") {
      return (
        <a
          key={mark.attrs.href}
          href={mark.attrs.href}
          className="text-accent underline-offset-2 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          {acc}
        </a>
      );
    }
    return acc;
  }, text);
}

function renderNode(node: TipTapNode, index: number): ReactNode {
  const key = `${node.type ?? "n"}-${index}`;

  switch (node.type) {
    case "doc":
      return <>{node.content?.map((child, i) => renderNode(child, i))}</>;
    case "paragraph":
      return (
        <p key={key} className="leading-relaxed text-foreground">
          {node.content?.map((child, i) => renderNode(child, i)) ?? null}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const children = node.content?.map((child, i) => renderNode(child, i));
      if (level === 3) {
        return (
          <h3 key={key} className="mt-8 font-display text-2xl tracking-wide">
            {children}
          </h3>
        );
      }
      return (
        <h2 key={key} className="mt-10 font-display text-3xl tracking-wide">
          {children}
        </h2>
      );
    }
    case "bulletList":
      return (
        <ul key={key} className="list-disc space-y-2 pl-6">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="list-decimal space-y-2 pl-6">
          {node.content?.map((child, i) => renderNode(child, i))}
        </ol>
      );
    case "listItem":
      return <li key={key}>{node.content?.map((child, i) => renderNode(child, i))}</li>;
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-2 border-accent/60 pl-4 italic text-muted"
        >
          {node.content?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );
    case "hardBreak":
      return <br key={key} />;
    case "horizontalRule":
      return <hr key={key} className="my-8 border-border" />;
    case "image": {
      const src = mediaUrl(typeof node.attrs?.src === "string" ? node.attrs.src : null);
      const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
      if (!src) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={key}
          src={src}
          alt={alt}
          className="my-6 w-full rounded-2xl object-cover"
        />
      );
    }
    case "text":
      return (
        <span key={key}>{renderMarks(node.text ?? "", node.marks)}</span>
      );
    default:
      if (node.content?.length) {
        return <>{node.content.map((child, i) => renderNode(child, i))}</>;
      }
      return null;
  }
}

export function TipTapContent({ content }: { content: unknown }) {
  if (!content || typeof content !== "object") {
    return <p className="text-muted">Conținut editorial în curs de publicare.</p>;
  }

  const nodes = (content as TipTapNode).content;
  if (!nodes?.length) {
    return <p className="text-muted">Conținut editorial în curs de publicare.</p>;
  }

  return <div className="space-y-4">{nodes.map((node, i) => renderNode(node, i))}</div>;
}
