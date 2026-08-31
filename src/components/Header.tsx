import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/lib/actions";
import CrabLogo from "@/components/CrabLogo";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-10 border-b border-(--color-border) bg-(--color-surface)/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-(--color-primary)">
          <CrabLogo />
          Crabby
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
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
            <span className="flex items-center gap-2">
              <span className="text-(--color-muted)">Hi, {user.name.split(" ")[0]}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-(--color-muted) underline decoration-dotted hover:text-(--color-primary)"
                >
                  Log out
                </button>
              </form>
            </span>
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
