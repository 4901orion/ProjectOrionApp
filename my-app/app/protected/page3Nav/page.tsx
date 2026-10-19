import {Sidebar} from "@/components/sidebar";
import './nav.css';
import { Badge } from "@/components/ui/badge";

export default function page3() {
  return (
    <div className="sidenav">
        <div className="flex flex-col max-w-full gap-2 p-2">
            <Badge className="w-32" variant="default" >
                Applicant
            </Badge> 
        </div>
         <Sidebar />
    </div>
  );
}
