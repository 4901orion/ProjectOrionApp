
import { Button } from "@/components/ui/button";

export default function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      
      <div className="flex justify-center gap-2 items-start">
        
        {/*Testing- navigation to new page */}

        <Button asChild className="mx-4">
          <a href="/protected/page3Nav">nav test Page</a>
        </Button>

        <Button asChild className="mx-4">
          <a href="/admin" target="_blank">
            admin
          </a>
        </Button>

        <Button asChild className="mx-4">
          <a href="/protected/fileUpload">File Upload</a>
        </Button>


      </div>
    </div>
  );
}
