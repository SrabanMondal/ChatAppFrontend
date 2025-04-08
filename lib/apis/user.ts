import axios from 'axios';
import { axiosPublic, axiosPrivate } from './axios';

type Credentials = {
  username: string;
  email: string;
  password: string;
};

export const registerUser = async (data: Credentials):Promise<{message:string, status:true}|null> => {
  const res = await axiosPublic.post('/user/register', data);
  //console.log(res)
  return res.data;
};

export const verifyOtp = async (otp: string):Promise<{message:string}|null> => {
  const res = await axiosPublic.post('/user/verifyotp', { otp });
  return res.data;
};

export const loginUser = async (email: string, password: string):Promise<{userId:number, message:string, token: string}|null> => {
  const res = await axios.post('/api/login', { email, password });
  //console.log(res)
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axiosPublic.post('/user/forgetPassword', { email });
  return res.data;
};

export const resetPassword = async (otp: string, password: string) => {
  const res = await axiosPublic.post('/user/resetPassword', { otp, password });
  return res.data;
};

export const uploadProfilePic = async (file: File) => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  const res = await axiosPrivate.post('/user/addprofilepic', formData);
  return res.data;
};

export const deleteProfilePic = async () => {
  const res = await axiosPrivate.delete('/user/deleteprofilepic');
  return res.data;
};

export const getProfile = async () => {
  const res = await axiosPrivate.get('/user/profile');
  //console.log(res.data);
  return res.data;
};

export const updateName = async (name: string) => {
  const res = await axiosPrivate.put('/user/name', { name });
  return res.data;
};
