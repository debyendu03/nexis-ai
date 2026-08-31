import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-dvh flex flex-col items-center justify-center gap-5 text-center">
      <h1 className="text-8xl md:text-9xl font-bold m-0">404</h1>
      <p className="text-xl md:text-2xl m-0">Page not found</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg text-sm bg-surface hover:bg-accent hover:text-white transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}