import NextlyForm from "@/components/forms/nextly-form";

interface ApplyPageProps {
  params: Promise<{ formId: string }>;
}

// Shows a form built in Admin → Forms. The URL is /apply/<form slug>,
// e.g. a form with slug "test-apply" lives at /apply/test-apply.
// The form must be Published. Submissions appear in Admin → Forms → Submissions.
export default async function ApplyPage({ params }: ApplyPageProps) {
  const { formId } = await params;

  return (
    <main className="w-full mx-auto py-12 px-10">
      <NextlyForm slug={formId} />
    </main>
  );
}
