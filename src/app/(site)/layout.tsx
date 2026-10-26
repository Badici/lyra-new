import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getActiveCategories } from "@/features/products/queries";
import { isAdminRole } from "@/server/auth/roles";
import { getSession } from "@/server/auth/session";

/** Public catalog/content should refresh after admin edits without full redeploy. */
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let showAdminLink = false;
  let categories: { name: string; slug: string }[] = [];
  try {
    const session = await getSession();
    const role = (session?.user as { role?: string } | undefined)?.role;
    showAdminLink = isAdminRole(role);
  } catch {
    showAdminLink = false;
  }

  try {
    const rows = await getActiveCategories();
    categories = rows.map((category) => ({ name: category.name, slug: category.slug }));
  } catch (error) {
    console.error("[nav categories]", error);
  }

  return (
    <>
      <SiteHeader showAdminLink={showAdminLink} categories={categories} />
      <main className="flex-1">{children}</main>
      <SiteFooter categories={categories} />
    </>
  );
}
