import { login, signup } from "./actions";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { SubmitButton } from "@/components/SubmitButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-16">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-[var(--shadow-card)]">
        <h1 className="mb-6 text-2xl font-extrabold text-foreground">
          Sign in to 123or4
        </h1>

        <GoogleSignInButton />

        <div className="my-5 flex items-center gap-4 text-sm text-text-secondary">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <form className="flex flex-col gap-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-lg border border-border bg-surface px-4 py-3 text-foreground"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={6}
            className="rounded-lg border border-border bg-surface px-4 py-3 text-foreground"
          />
          {error && <p className="text-sm text-coral-deep">{error}</p>}
          {message && <p className="text-sm text-cat-homes">{message}</p>}
          <div className="flex gap-3">
            <SubmitButton
              formAction={login}
              pendingLabel="Signing in..."
              className="flex-1 rounded-full bg-coral px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              Sign in
            </SubmitButton>
            <SubmitButton
              formAction={signup}
              pendingLabel="Signing up..."
              className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-muted"
            >
              Sign up
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
