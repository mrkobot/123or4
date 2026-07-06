import { login, signup } from "./actions";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-50 p-16 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Sign in to 123or4
      </h1>

      <div className="w-full max-w-sm">
        <GoogleSignInButton />
      </div>

      <div className="flex w-full max-w-sm items-center gap-4 text-zinc-500">
        <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
        or
        <div className="h-px flex-1 bg-zinc-300 dark:bg-zinc-700" />
      </div>

      <form className="flex w-full max-w-sm flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-lg border border-black/[.15] px-4 py-3 dark:border-white/[.2] dark:bg-zinc-900"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={6}
          className="rounded-lg border border-black/[.15] px-4 py-3 dark:border-white/[.2] dark:bg-zinc-900"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-700">{message}</p>}
        <div className="flex gap-3">
          <button
            formAction={login}
            className="flex-1 rounded-full bg-foreground px-5 py-3 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Sign in
          </button>
          <button
            formAction={signup}
            className="flex-1 rounded-full border border-solid border-black/[.15] px-5 py-3 text-base font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.08]"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
