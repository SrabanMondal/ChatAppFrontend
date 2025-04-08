"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Trash2 } from "lucide-react";
import {
  getProfile,
  updateName,
  uploadProfilePic,
  deleteProfilePic,
} from "@/lib/apis/user";
import { toast, ToastContainer } from "react-toastify";

// Interfaces
interface User {
  userId: number;
  email: string;
}

interface Friend {
  name: string;
  profilepic?: string;
}

interface MongoUser {
  name: string;
  profilepic?: string;
  friends: Friend[];
}

interface Profile {
  user: User;
  mongoUser: MongoUser;
}

export function ProfileForm() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
        setName(profileData.mongoUser.name);
        setAvatarPreview(profileData.mongoUser.profilepic || null);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  async function handleNameUpdate() {
    if (name.length < 2) return;

    setIsSaving(true);
    try {
      const response = await updateName(name);
      if(response){
        toast.success('Name updated')
      }
      if (profile) {
        setProfile({
          ...profile,
          mongoUser: { ...profile.mongoUser, name },
        });
      }
      //console.log("Name updated:", response);
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      const response = await uploadProfilePic(file);
      if(response){
        if (profile) {
          setProfile({
            ...profile,
            mongoUser: {
              ...profile.mongoUser,
              profilepic: response.profilepic || avatarPreview,
            },
          });
        }
        toast.success("Profile pic updated")
      }
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
      setAvatarPreview(profile?.mongoUser.profilepic || null);
    }
  }

  async function handleAvatarDelete() {
    try {
      const response = await deleteProfilePic();
      if (profile) {
        setProfile({
          ...profile,
          mongoUser: { ...profile.mongoUser, profilepic: undefined },
        });
        setAvatarPreview(null);
      }
    } catch (error) {
      console.error("Failed to delete profile picture:", error);
    }
  }

  if (loading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription className="text-zinc-400">
            View and update your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-[100px] mt-4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border border-zinc-800 text-white shadow-xl">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription className="text-zinc-400">
          View and update your profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={avatarPreview || profile?.mongoUser.profilepic}
                alt={profile?.mongoUser.name}
              />
              <AvatarFallback>{profile?.mongoUser.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 flex space-x-2">
              <label
                htmlFor="avatar-upload"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-md hover:bg-emerald-700 transition"
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload avatar</span>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleAvatarDelete}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-zinc-200 hover:bg-red-600 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete avatar</span>
                </button>
              )}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">{profile?.mongoUser.name}</h3>
            <p className="text-sm text-zinc-400">{profile?.user.email}</p>
          </div>
        </div>

        {/* Name Update */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-200">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-zinc-800 text-white border-zinc-700 placeholder-zinc-500 focus:ring-emerald-600 focus:border-emerald-600"
            />
          </div>
          <Button
            onClick={handleNameUpdate}
            disabled={isSaving || name.length < 2}
            className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>

        {/* Friends */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-zinc-300">Friends</h4>
          {profile?.mongoUser.friends.length === 0 ? (
            <p className="text-sm text-zinc-500">No friends yet.</p>
          ) : (
            <ul className="space-y-4">
              {profile?.mongoUser.friends.map((friend, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friend.profilepic} alt={friend.name} />
                    <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-white">
                    {friend.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
      <ToastContainer/>
    </Card>
  );
}
