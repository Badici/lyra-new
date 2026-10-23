"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type TiptapEditorProps = {
  name: string;
  initialContent?: Record<string, unknown>;
  className?: string;
};

export function TiptapEditor({ name, initialContent, className }: TiptapEditorProps) {
  const [jsonValue, setJsonValue] = useState(
    JSON.stringify(initialContent ?? { type: "doc", content: [] }),
  );
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl my-4 max-w-full h-auto",
        },
      }),
    ],
    content: initialContent ?? { type: "doc", content: [] },
    immediatelyRender: false,
    onUpdate: ({ editor: ed }) => {
      setJsonValue(JSON.stringify(ed.getJSON()));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-cream/90",
      },
    },
  });

  async function insertImage(file: File | null) {
    if (!file || !editor) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Upload eșuat");
        return;
      }
      editor.chain().focus().setImage({ src: data.url }).run();
      toast.success("Imagine inserată");
    } catch {
      toast.error("Upload eșuat");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("admin-card overflow-hidden", className)}>
      <div className="flex flex-wrap gap-1 border-b border-border bg-[var(--surface)] p-2">
        <ToolbarButton
          label="B"
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="I"
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="H2"
          active={editor?.isActive("heading", { level: 2 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          label="H3"
          active={editor?.isActive("heading", { level: 3 })}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <ToolbarButton
          label="•"
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="1."
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        />
        <label className="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-medium text-muted hover:bg-forest/60 hover:text-cream">
          {uploading ? "…" : "Imagine"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              void insertImage(e.target.files?.[0] ?? null);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={jsonValue} readOnly />
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1 text-xs font-medium transition",
        active ? "bg-accent/25 text-accent" : "text-muted hover:bg-forest/60 hover:text-cream",
      )}
    >
      {label}
    </button>
  );
}
