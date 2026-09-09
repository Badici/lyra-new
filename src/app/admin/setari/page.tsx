import { PageHeader } from "@/components/admin/page-header";
import { updateSiteSettings } from "@/features/settings/admin-actions";
import { getSiteSettings } from "@/features/settings/queries";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title="Setări"
        description="Informații de business non-secrete. Secretele rămân în variabilele de mediu."
      />
      <form action={updateSiteSettings} className="admin-card grid max-w-xl gap-4 p-5">
        <div>
          <label className="admin-label" htmlFor="contactEmail">
            Email contact
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            defaultValue={settings.contact.email}
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="contactWhatsapp">
            WhatsApp (cu prefix țară)
          </label>
          <input
            id="contactWhatsapp"
            name="contactWhatsapp"
            required
            defaultValue={settings.contact.whatsapp}
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="orderPrefix">
            Prefix număr comandă
          </label>
          <input
            id="orderPrefix"
            name="orderPrefix"
            required
            defaultValue={settings.orders.prefix}
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="socialFacebook">
            Facebook URL
          </label>
          <input
            id="socialFacebook"
            name="socialFacebook"
            defaultValue={settings.social.facebook}
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="socialInstagram">
            Instagram URL
          </label>
          <input
            id="socialInstagram"
            name="socialInstagram"
            defaultValue={settings.social.instagram}
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="socialYoutube">
            YouTube URL
          </label>
          <input
            id="socialYoutube"
            name="socialYoutube"
            defaultValue={settings.social.youtube}
            className="admin-input"
          />
        </div>
        <button type="submit" className="rounded-xl bg-accent px-4 py-2 text-sm text-cream">
          Salvează setările
        </button>
      </form>
    </div>
  );
}
