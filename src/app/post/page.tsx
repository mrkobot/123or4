import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { postListing } from "./actions";
import { PostForm } from "@/components/PostForm";

export default async function PostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-16">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-[var(--shadow-card)]">
        <h1 className="mb-6 text-2xl font-extrabold text-foreground">
          Post a classified
        </h1>
        <PostForm formAction={postListing} error={error} />
      </div>
    </div>
  );
}
