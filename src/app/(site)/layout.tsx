import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { isAdminRole } from "@/server/auth/roles";
import { getSession } from "@/server/auth/session";

/** Public catalog/content should refresh after admin edits without full redeploy. */
export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let showAdminLink = false;
  try {
    const session = await getSession();
    const role = (session?.user as { role?: string } | undefined)?.role;
    showAdminLink = isAdminRole(role);
  } catch {
    showAdminLink = false;
  }

  return (
    <>
      <SiteHeader showAdminLink={showAdminLink} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
