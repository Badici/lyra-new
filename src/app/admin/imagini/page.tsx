import { AdminForm } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/image-field";
import { PageHeader } from "@/components/admin/page-header";
import { SubmitButton } from "@/components/admin/submit-button";
import { updateSectionImages } from "@/features/settings/admin-actions";
import { getSectionImages } from "@/features/settings/queries";

const FIELDS = [
  { key: "produse", label: "Header produse și primul slide" },
  { key: "articole", label: "Header articole și al doilea slide" },
  { key: "emisiuni", label: "Header emisiuni și al treilea slide" },
  { key: "poveste", label: "Slide-ul de poveste și fotografia de pe homepage" },
] as const;

export default async function AdminImagesPage() {
  const images = await getSectionImages();

  return (
    <div className="space-y-6 p-4 md:p-8">
      <PageHeader
        title="Imagini"
        description="Pozele de header și din carusel. La încărcare le încadrezi la 2100×900 px."
      />
      <AdminForm action={updateSectionImages} className="admin-card grid max-w-3xl gap-6 p-5">
        {FIELDS.map((field) => (
          <ImageField
            key={field.key}
            name={field.key}
            label={field.label}
            preset="banner"
            defaultValue={images[field.key].src}
          />
        ))}
        <SubmitButton label="Salvează imaginile" pendingLabel="Se salvează…" variant="accent" />
      </AdminForm>
    </div>
  );
}
