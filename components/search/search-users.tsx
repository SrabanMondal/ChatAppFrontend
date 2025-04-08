"use client"

import type React from "react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { UserPlus, Search } from "lucide-react"
import { addFriend, searchUsers, UserData } from "@/lib/apis/chat"
import { toast, ToastContainer } from "react-toastify"

export function SearchUsers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setLoading(true)
    setSearched(true)

    try {
      const response = await searchUsers(searchQuery)
      if (response) {
        setUsers(response.users)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddFriend(userId: number) {
    const response = await addFriend(userId)
    if (response) {
      //console.log(response.message)
      toast.success("Friend Added")
    } else {
      console.log("Error adding friend")
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4 sm:w-[80%]">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          <Search className="w-4 h-4" />
          
        </Button>
      </form>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="w-10 h-10 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Users Found */}
      {!loading && searched && users.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <Search className="mx-auto w-10 h-10 mb-4" />
          <h3 className="text-lg font-semibold">No users found</h3>
          <p className="text-sm">Try searching with a different name.</p>
        </div>
      )}

      {/* Found Users */}
      {!loading && users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.profilepic} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{user.name}</h4>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddFriend(user.id)}
                  >
                    <UserPlus className="w-4 h-4" />
                    
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ToastContainer/>
    </div>
  )
}
