"use client";

import { BalanceCard } from "@/components/balance-ui";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = () => {
  const user = useCurrentUser();

  return ( 
   <BalanceCard user={user} />
 
  
   );
}
 
export default ClientPage;