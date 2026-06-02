export default function AdminSettingsPage() {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-[var(--lake)]/30 p-5">
      <h1 className="text-3xl font-semibold text-[var(--cream)]">Setări platformă</h1>
      <ul className="space-y-2 text-sm text-[var(--muted)]">
        <li>
          Email comenzi admin:{" "}
          <span className="text-[var(--cream)]">
            {process.env.ADMIN_NOTIFICATION_EMAIL ??
              "raresbadici+comenzilyra@gmail.com"}
          </span>
        </li>
        <li>
          Mail provider: <span className="text-[var(--cream)]">Resend</span>
        </li>
        <li>
          Payment default: <span className="text-[var(--cream)]">Ramburs (COD)</span>
        </li>
        <li>
          Tracking Levi:{" "}
          <span className="text-[var(--cream)]">
            utm_source=lyra&utm_medium=referral&utm_campaign=plumbi_momitoare
          </span>
        </li>
      </ul>
    </div>
  );
}
