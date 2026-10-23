"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { toast } from "sonner";
import { recordPageView } from "@/features/analytics/actions";
import { formatViews } from "@/lib/views";

type Kind = "product" | "article";

type Props = {
  kind: Kind;
  slug: string;
  initialCount: number;
  title: string;
};

export function PageStats({ kind, slug, initialCount, title }: Props) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const key = `lyra-view:${kind}:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    setCount((current) => current + 1);
    recordPageView(kind, slug)
      .then((saved) => {
        if (saved) return;
        sessionStorage.removeItem(key);
        setCount(initialCount);
      })
      .catch(() => {
        sessionStorage.removeItem(key);
        setCount(initialCount);
      });
  }, [initialCount, kind, slug]);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <p className="inline-flex items-center gap-2 text-sm text-muted">
        <Eye className="h-4 w-4" aria-hidden />
        <span>{formatViews(count)}</span>
      </p>
      <ShareButtons title={title} />
    </div>
  );
}

function ShareButtons({ title }: { title: string }) {
  async function share(network: "facebook" | "whatsapp" | "instagram" | "tiktok") {
    const url = window.location.href;

    if (network === "facebook") {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      window.open(shareUrl, "lyra-facebook-share", "noopener,noreferrer,width=640,height=520");
      return;
    }

    if (network === "whatsapp") {
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      return;
    }

    const destination =
      network === "instagram" ? "https://www.instagram.com/" : "https://www.tiktok.com/";
    const label = network === "instagram" ? "Instagram" : "TikTok";

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    window.open(destination, "_blank", "noopener,noreferrer");
    const copied = await copyPageUrl(url);
    if (copied) {
      toast.success(`Link copiat. Lipește-l în ${label}.`);
      return;
    }
    toast.message(`Deschide ${label} și lipește linkul paginii.`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Distribuie pagina">
      <span className="text-sm text-muted">Distribuie</span>
      <ShareButton label="Distribuie pe Facebook" onClick={() => share("facebook")}>
        <FacebookIcon />
      </ShareButton>
      <ShareButton label="Distribuie pe WhatsApp" onClick={() => share("whatsapp")}>
        <WhatsAppIcon />
      </ShareButton>
      <ShareButton label="Distribuie pe Instagram" onClick={() => share("instagram")}>
        <InstagramIcon />
      </ShareButton>
      <ShareButton label="Distribuie pe TikTok" onClick={() => share("tiktok")}>
        <TikTokIcon />
      </ShareButton>
    </div>
  );
}

async function copyPageUrl(url: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await Promise.race([
        navigator.clipboard.writeText(url),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 700)),
      ]);
      return true;
    }
  } catch {
    // Fall through to the older copy command.
  }

  try {
    const input = document.createElement("textarea");
    input.value = url;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    return copied;
  } catch {
    return false;
  }
}

function ShareButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border text-foreground transition duration-300 ease-out hover:scale-[1.03] hover:bg-fog/60"
    >
      {children}
    </button>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.4 3 11 4.4 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.3l.4-2.8h-2.7z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12.04 3C7.31 3 3.5 6.7 3.5 11.3c0 1.46.4 2.88 1.16 4.12L3.4 21l5.72-1.22a8.7 8.7 0 0 0 2.92.5c4.73 0 8.54-3.7 8.54-8.3S16.77 3 12.04 3zm4.96 11.72c-.2.58-1.18 1.1-1.64 1.16-.42.06-.96.08-1.54-.1-.36-.1-.82-.26-1.42-.52-2.5-1.08-4.12-3.6-4.24-3.76-.12-.18-1-1.32-1-2.52s.62-1.78.86-2.02c.22-.24.48-.3.64-.3h.46c.14 0 .34-.02.52.4.2.46.66 1.6.72 1.72.06.12.1.26.02.42-.08.16-.12.26-.24.4-.12.14-.26.32-.36.42-.12.12-.24.26-.1.5.14.24.62 1.02 1.32 1.66.92.82 1.68 1.08 1.92 1.2.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.58-.14 1.16z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="5" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.5" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M14.2 3c.4 2.4 1.8 4.1 4.1 4.4v2.5c-1.4 0-2.7-.4-3.9-1.2v6.4c0 3.3-2.6 5.9-6 5.9S2.4 18.4 2.4 15.1c0-3.2 2.5-5.8 5.7-5.9v2.6c-1.7.1-3.1 1.5-3.1 3.3 0 1.8 1.5 3.3 3.3 3.3s3.3-1.5 3.3-3.3V3h2.6z" />
    </svg>
  );
}
