import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/errors";
import { registerSchema } from "@/lib/auth-schemas";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CLIENT" | "ACCOUNTANT">("CLIENT");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const parsed = registerSchema.safeParse({ name, email, password, role });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const next: Record<string, string> = {};
      if (flat.name?.[0]) next.name = flat.name[0];
      if (flat.email?.[0]) next.email = flat.email[0];
      if (flat.password?.[0]) next.password = flat.password[0];
      setFieldErrors(next);
      return;
    }

    setPending(true);
    try {
      const result = await register(parsed.data);
      nav("/verify-email", {
        replace: true,
        state: {
          token: result.mockEmailVerification.token,
          expiresAt: result.mockEmailVerification.expiresAt,
          message: result.mockEmailVerification.message,
        },
      });
    } catch (err) {
      if (err instanceof ApiError && err.code === "EMAIL_TAKEN") {
        setError("This email is already registered.");
        return;
      }
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16">
      <div>
        <h1 className="text-2xl font-semibold text-white">Create your account</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Choose <strong className="text-zinc-300">UK business</strong> or <strong className="text-zinc-300">Accountant</strong>.
          An administrator must approve your account before you can sign in.
        </p>
      </div>
      <Card>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Full name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            {fieldErrors.name && <p className="mt-1 text-xs text-rose-400">{fieldErrors.name}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Email</label>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && <p className="mt-1 text-xs text-rose-400">{fieldErrors.email}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Password</label>
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && <p className="mt-1 text-xs text-rose-400">{fieldErrors.password}</p>}
            <p className="mt-1 text-xs text-zinc-600">8+ characters, at least one letter and one number.</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">I am a</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("CLIENT")}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  role === "CLIENT" ? "border-indigo-400/60 bg-indigo-500/20 text-white" : "border-white/10 bg-black/30"
                }`}
              >
                UK business
              </button>
              <button
                type="button"
                onClick={() => setRole("ACCOUNTANT")}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  role === "ACCOUNTANT"
                    ? "border-indigo-400/60 bg-indigo-500/20 text-white"
                    : "border-white/10 bg-black/30"
                }`}
              >
                Accountant
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating…" : "Create account"}
          </Button>
        </form>
      </Card>
      <p className="text-center text-sm text-zinc-500">
        Already registered?{" "}
        <Link className="text-indigo-300 hover:text-indigo-200" to="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
