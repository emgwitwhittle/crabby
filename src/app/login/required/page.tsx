export default function LoginRequiredPage() {
  return (
    <div className="card mx-auto mt-12 max-w-md p-6 text-center">
      <h1 className="text-xl font-bold">Crabby is for the crew only</h1>
      <p className="mt-2 text-(--color-muted)">
        You&apos;ll need your personal login link to get in. Ask whoever set up your account to
        send it to you — it looks like <span className="font-mono text-sm">/login/…</span>.
      </p>
    </div>
  );
}
