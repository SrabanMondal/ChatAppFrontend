"use client"
import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare } from "lucide-react"
import { ChatWindow, Message } from "@/components/chat/chat-window"
import { useSocket } from "@/lib/socket-context"
import { getFriends, UserData } from "@/lib/apis/chat"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
const CustomToast = ({ closeToast, message }: { closeToast?: () => void; message: Message }) => (
  <div>
    <strong>{message.senderName}</strong>
    <br />
    {message.content}
  </div>
);
export function FriendsList({token}:{token:string}) {
  const [friends, setFriends] = useState<UserData[]|null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFriend, setSelectedFriend] = useState<UserData | null>(null)
  const [userId, setUserId] = useState<number|null>(null) // Default user ID, should come from auth
  const { socket, connect, isConnected } = useSocket()
  const [onlinefriendIds, setonlineFriendIds] = useState<Set<number>|null>(null)
  useEffect(() => {
    //const token = localStorage.getItem('token')
    // Connect to socket when component mounts
    //console.log(token,userId);
    if(!token){
      redirect('/auth/login')
    }
    if (!isConnected) {
      connect(token)
    }
    const uid = localStorage.getItem('userId')
    setUserId(Number(uid))
    if (!socket || !isConnected) {
      //console.log("ChatWindow Effect: Socket not available or not connected.")
      return
    }
    const handleOnlineFriends=(onlineFriends:UserData[])=>{
      //console.log("Received online friends");
      //console.log(onlineFriends);
      //console.log(friends);
      setonlineFriendIds(new Set(onlineFriends.map(friend=>friend.id)));
    }
    const handleRoomJoined=(data:{roomJoined:string, participants:any})=>{
      //console.log(data);
    }
    const handleNewMessageNotification=(data:Message)=>{
      //console.log("Received new message notification");
      //console.log(data);
      //console.log(selectedFriend)
      if(!selectedFriend || selectedFriend?.id!=data.senderId){
        toast.success(<CustomToast message={data} />, {icon: false});
        return;
      }
    }
    const handleFriendStatus = (data:{userId:number, status:'online'|'offline'})=>{
      //console.log("Received friend status");
      //console.log(data);
      const {userId, status} = data;
      if(status=='online'){
        setonlineFriendIds(prev=>new Set(prev).add(userId));
      }
      if(status=='offline'){
        //console.log(onlinefriendIds)
        if (onlinefriendIds?.has(userId)) {
          setonlineFriendIds(prev => {
            if (!prev) return null;
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        }
      }
    }
    if(isConnected){
      socket.on('onlineFriends',handleOnlineFriends)
    }
    socket.on('roomJoined',handleRoomJoined)
    socket.on('newMessageNotification',handleNewMessageNotification)
    socket.on('userStatus',handleFriendStatus)
    socket.emit('getOnlineFriends',{userId})
    return () => {
      socket.off('onlineFriends',handleOnlineFriends)
      socket.off('roomJoined',handleRoomJoined)
      socket.off('newMessageNotification',handleNewMessageNotification)
    }
  }, [connect, isConnected, userId, selectedFriend])

  useEffect(() => {
    // In a real app, you would fetch friends from your API
    const fetchFriends = async () => {
      // Simulate API call
      const response = await getFriends()
      if(response){
        setFriends(response.friends)
      }
      setLoading(false)
    }

    fetchFriends()
  }, [])

  const handleChatWithFriend = (friend: UserData) => {
    setSelectedFriend(friend)
  }

  const handleCloseChat = () => {
    setSelectedFriend(null)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (friends && friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
      <MessageSquare className="h-10 w-10 text-muted-foreground" />
      <h3 className="text-xl font-semibold text-foreground">No friends yet</h3>
      <p className="text-sm text-muted-foreground">Search for users to start chatting with them!</p>
      <Button className="mt-2 px-6 py-2 rounded-xl" asChild>
        <a href="/dashboard/search">Find Friends</a>
      </Button>
    </div>
    
    )
  }

  return (
    <div className="space-y-6">
      {selectedFriend && userId ? (
        <ChatWindow friend={selectedFriend} userId={userId} onClose={handleCloseChat} onlineIds={onlinefriendIds} />
      ) : (
        <div className="space-y-3">
          {friends && friends.map((friend) => (
            <Card
              key={friend.id}
              className="hover:bg-accent/50 transition-colors cursor-pointer bg-black rounded-lg overflow-hidden"
              onClick={() => handleChatWithFriend(friend)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={friend.profilepic} alt={friend.name} />
                      <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {onlinefriendIds && (
                    onlinefriendIds.has(friend.id) ? (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                                            ) : (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-slate-500 border-2 border-background"></span>
                                   )
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-medium">{friend.name}</h4>
                      
                    </div>
                   
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleChatWithFriend(friend)
                    }}
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
       <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </div>
  )
}

