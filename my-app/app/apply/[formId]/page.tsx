import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

interface ApplyPageProps {
  params: Promise<{ formId: string }>;
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { formId } = await params;

  // 1. Server Action to process applicant inputs and store them in Supabase
  async function submitApplication(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const submissionData = Object.fromEntries(formData.entries());

    // Insert the submission directly into your form_submissions table
    const { error } = await supabase
      .from("form_submissions")
      .insert({
        form_slug: formId,
        submission_data: submissionData,
        status: "submitted",
      });

    if (error) {
      console.error("Supabase error:", error.message);
      throw new Error("Failed to submit form.");
    }
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Application Form</h1>
      
      {/* 2. Standard HTML form wired to your Next.js Server Action */}
      <form action={submitApplication} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Your Name / Details</label>
          <input 
            type="text" 
            name="applicant_name" 
            required 
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="box" 
              value="yes"
              required 
            />
            <span className="text-sm">I agree to the terms</span>
          </label>
        </div>

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Submit Application
        </button>
      </form>
    </main>
  );
}