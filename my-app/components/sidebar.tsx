import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

   
export  function Sidebar() {
    return (    
        <div className="sidebar">
            <ul>    
                <li>
                    <Badge variant="secondary" className="w-32">
                       home
                    </Badge>
                </li>
                </ul>
        </div>
    );
}
