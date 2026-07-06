"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  formAction,
  pendingLabel,
  children,
  className,
}: {
  formAction: (formData: FormData) => void;
  pendingLabel: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
