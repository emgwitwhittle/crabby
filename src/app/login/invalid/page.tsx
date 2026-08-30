import Link from "next/link";

export default function InvalidLoginPage() {
  return (
    <div className="card mx-auto mt-12 max-w-md p-6 text-center">
      <h1 className="text-xl font-bold">Login link not recognized</h1>
      <p className="mt-2 text-(--color-muted)">
        That link doesn&apos;t match anyone in the crew. Double-check it, or ask whoever set up
        your account to resend your personal link.
      </p>
      <Link href="/" className="btn-primary mt-4 inline-flex">
        Back to Home
      </Link>
    </div>
  );
}
