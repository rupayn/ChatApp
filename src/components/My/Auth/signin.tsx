import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./PasswordInput";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { server } from "@/constant/config";
import { useDispatch } from "react-redux";
import { login } from "@/Store/AuthSlice";

export default function Signin() {
  const [password, setPassword] = useState("")
  const [email,setEmail]=useState("")
  const dispatch=useDispatch()
  const loginHandler=(email:unknown,password:unknown)=>{
    axios
      .post(`${server}/api/auth/signin`, { email, password },{withCredentials: true,headers: { 'Content-Type': 'application/json'}})
      .then((res) => {
        // Handle successful login
        console.log(res.data);
        
        dispatch(login(res.data))
        // console.log(response);
        // axios
        //   .get(`${server}/api/user/me`, {
        //     withCredentials: true,
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //   })
        //   .then((res) => {
        //     console.log(res.data.fname);
        //     user(res.data)
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
      })
      .catch((error) => {
        // Handle failed login
        console.error(error);
      });
  }
  const setEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  return (
    <div className="bg-slate-700">
      <div className="flex h-screen items-center justify-center">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email or User Name</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  onChange={(e)=>{setEmailHandler(e)}}
                  placeholder="m@example.com or abcd123"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link
                    to={"#"}
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link> */}
                </div>
                <PasswordInput
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              <Button type="submit" className="w-full hover:bg-green-200" onClick={()=>{loginHandler(email,password)}}>
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to={"/signup"} className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
