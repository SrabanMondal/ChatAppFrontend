import { cookies } from 'next/headers';
import { FriendsList } from "@/components/friends/friends-list";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token =  cookieStore.get('authtoken')?.value;
  const userId = Number(cookieStore.get('userId')?.value);
  if(token && userId) {
    //console.log(token)
    //console.log(userId)
    return (
      <DashboardLayout>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Friends</h1>
        <FriendsList token={token} />
      </div>
    </DashboardLayout>
  );
}else{
  return <div>You are not logged in. Please log in to view your friends list.</div>
}
}
