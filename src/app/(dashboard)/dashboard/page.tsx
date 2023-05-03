import Button from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { CloudCog } from "lucide-react";
import { getServerSession } from "next-auth";
import { FC } from "react"; 


const page = async ({}) => {
    
    const session = await getServerSession(authOptions)

    console.log(session)
    
    return <pre>{JSON.stringify(session)}</pre>
}

export default page;