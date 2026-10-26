import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { updateSiteSettings } from "@/features/settings/admin-actions";
import { getSiteSettings } from "@/features/settings/queries";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title="Setări"
        description="Emailul de contact apare pe pagina de Contact. Linkurile completate apar în footer. Lasă gol ce nu folosești."
      />
      <AdminForm action={updateSiteSettings} className="admin-card grid max-w-xl gap-4 p-5">
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
            placeholder="https://"
            className="admin-input"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="socialTiktok">
            TikTok URL
          </label>
          <input
            id="socialTiktok"
            name="socialTiktok"
            defaultValue={settings.social.tiktok}
            placeholder="https://www.tiktok.com/@contul-tau"
            className="admin-input"
          />
        </div>
        <SubmitButton label="Salvează setările" pendingLabel="Se salvează…" variant="accent" />
      </AdminForm>
    </div>
  );
}
