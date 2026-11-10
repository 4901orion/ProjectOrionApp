import { createClient } from '@/lib/supabase/server'
import FileUpload from "@/components/uploads/file-upload";
import { redirect } from "next/navigation";

export default async function FileUploadPage() {
    const supabase = await createClient()
    const {data} = await supabase.auth.getClaims()
    const userId = data?.claims?.sub

    if (!userId) {
        redirect("/auth/login");
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-12">
            <h1 className="font-bold text-2xl mb-4">Upload Files</h1>
            <FileUpload userId={userId} />
        </div>
    );
}
