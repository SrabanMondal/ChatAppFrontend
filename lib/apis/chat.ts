import { axiosPrivate } from './axios';

export type UserData = {
  _id: string;
  id: number;
  name: string;
  profilepic?: string;
  pic_id?: string,
  room_id?: string[],
  friends?: string[];
};

type AddFriendDto = {
  friendId: number;
};

// 🔍 Search users by name
export const searchUsers = async (name: string): Promise<{users:UserData[]}|null> => {
  const res = await axiosPrivate.get(`/chat/search/${name}`);
  return res.data;
};

// ➕ Add a friend
export const addFriend = async (friendId: number): Promise<{ message: string }> => {
  const res = await axiosPrivate.post('/chat/friends', { friendId });
  return res.data;
};

// 📃 Get all friends
export const getFriends = async (): Promise<{ friends: UserData[] }> => {
  const res = await axiosPrivate.get('/chat/friends');
  return res.data;
};
