"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useState } from "react";
import { toast } from "sonner";
import { ImageCropDialog } from "@/components/admin/image-crop-dialog";
import { useAdminBusy } from "@/components/admin/admin-busy";
import { uploadAdminImage } from "@/components/admin/upload-client";
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
  const [file, setFile] = useState<File | null>(null);
  const busy = useAdminBusy();

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

  async function insertImage(blob: Blob) {
    if (!editor) return;
    setFile(null);
    busy.begin();
    try {
      const url = await uploadAdminImage(blob);
      editor.chain().focus().setImage({ src: url }).run();
      toast.success("Imagine inserată");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload eșuat");
    } finally {
      busy.end();
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
          Imagine (1600×900 px)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const next = event.target.files?.[0] ?? null;
              event.target.value = "";
              if (next) setFile(next);
            }}
          />
        </label>
      </div>
      <EditorContent editor={editor} />
      {file ? (
        <ImageCropDialog
          file={file}
          preset="inline"
          onCancel={() => setFile(null)}
          onConfirm={(blob) => void insertImage(blob)}
        />
      ) : null}
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
