import {  currentUser,  } from "@/lib/auth";
import { UserInfo } from "@/components/user-info";
import { User } from "next-auth";

const ServerPage = async () => {
 const user = await currentUser();
  return ( 
    <UserInfo
      
      user={user}
      
    />
   );
}
 
export default ServerPage;