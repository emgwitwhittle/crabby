import Link from "next/link";
import { getCurrentUser } from "@/lib/session";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-10 border-b border-(--color-border) bg-(--color-surface)/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-(--color-primary)">
          <span aria-hidden>🦀</span>
          Crabby
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-(--color-foreground) hover:text-(--color-primary)">
            Home
          </Link>
          <Link
            href="/locations"
            className="text-(--color-foreground) hover:text-(--color-primary)"
          >
            Locations
          </Link>
          <Link href="/haul" className="text-(--color-foreground) hover:text-(--color-primary)">
            Haul
          </Link>
          {user ? (
            <span className="text-(--color-muted)">Hi, {user.name.split(" ")[0]}</span>
          ) : (
            <span className="text-(--color-muted)" title="Visit your personal login link to sign in">
              Not logged in
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
