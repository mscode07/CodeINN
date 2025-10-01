import EditorHydrator from "@/components/EditorHydrator";
import EditorPageShell from "@/components/EditorPageShell";
import { notFound } from "next/navigation";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/history/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return notFound();

  const data = await res.json();

  return (
    <EditorHydrator data={data}>
      <EditorPageShell />
    </EditorHydrator>
  );
}
