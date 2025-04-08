import { NextResponse } from "next/server";
import {serialize} from 'cookie'
import axios from "axios";
const api = process.env.API_BASIC_URL
export async function POST(req:Request){
    try {
        const {email, password} = await req.json();
        //console.log(email,password,api);
        if(!email || !password){
            return NextResponse.json({ success: false, message: "Incomplete data" }, { status: 400 });
        }
        const response = await axios.post(api+'/user/login',{
            email:email,
        password: password
    })
    //console.log(response)
    if (response.data.userId)
    {
        const cookie = serialize("authtoken",response.data.token,{
            httpOnly: true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        })
        const userIdCookie = serialize("userId", response.data.userId, {
            httpOnly: false, // set to false so it's accessible in client if needed
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          });
        const res = new NextResponse(JSON.stringify({ status: true,message:response.data.message, token:response.data.token, userId:response.data.userId }), { status: 200 });
        res.headers.set("Authorization", `Bearer ${response.data.token}`);
        res.headers.append("Set-Cookie", cookie);
        res.headers.append("Set-Cookie", userIdCookie);
        //console.log(res)
        return res;
        }
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({success:false,message:error},{status:500})
    }
}