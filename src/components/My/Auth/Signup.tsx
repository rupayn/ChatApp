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

import { useState } from "react";
import { PasswordInput } from "./PasswordInput";
import axios from "axios";
import { server } from "@/constant/config";
import { useDispatch } from "react-redux";
import { login } from "@/Store/AuthSlice";

export default function Signup() {
  const [file, setFile] = useState("");
  const [newFile, setNewFile] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("")
  const [email, setMail] = useState("")
  const [fname, setFname] = useState("")
  const [uname, setUname] = useState("");
  const [errorMsg,setErrorMsg]=useState(undefined)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChange(e:any) {
    setFile(URL.createObjectURL(e.target.files[0]));
    setNewFile(e.target.files[0]);
    
  }
  const handleChangeFname = (e: { target: { value: string; }; }) => {
    const input = e.target.value;
    const capitalized = input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    setFname(capitalized);
  };
  const dispatch =useDispatch()
  const SignupHandler=()=>{
    setLoading(true);
    axios
      .post(
        `${server}/api/auth/signup`,
        {
          fname,
          email,
          password,
          uname,
          avatar: newFile,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((res) => {
        setLoading(false);
        dispatch(login(res.data))
      })
      .catch((err) => {
        setErrorMsg(err.response?.data?.message);
        setTimeout(() => {
          setErrorMsg(undefined);
        }, 4000);
        setLoading(false);
      });
  }
  return (
    <div>
      {loading ? (
        <div className="text-center mt-5 font-serif font-extrabold text-3xl">
          Loading...
        </div>
      ) : (
        <div className="flex bg-slate-700 h-screen items-center justify-center">
          <Card className="mx-auto max-w-sm">
            {errorMsg ? (
              <p className="text-center text-lg font-bold text-black bg-red-300 mt-2 rounded-lg mx-4">
                {errorMsg}
              </p>
            ) : (
              <div></div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center items-center">
                <img
                  src={file}
                  className={
                    file
                      ? `max-h-24 h-24 w-24 max-w-24 rounded-full `
                      : `hidden`
                  }
                  alt=""
                />
                <Button size={"sm"} className="px-0 py-0 mb-2">
                  <Input
                    type="file"
                    className="hidden"
                    accept=".jpg,.png"
                    id="img"
                    onChange={handleChange}
                    required
                  />
                  <Label htmlFor="img" className="h-9 px-4 py-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-plus"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </Label>
                </Button>
                <Label htmlFor="img" className="mb-2">
                  Upload Image
                </Label>
              </div>
              <div className="grid gap-4">
                <div className="grid  gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">Full name</Label>
                    <Input
                      name="fname"
                      type="text"
                      id="first-name"
                      className="max-w-80"
                      placeholder="john"
                      onChange={handleChangeFname}
                      value={fname}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="uname">User Name</Label>
                  <Input
                    id="uname"
                    type="text"
                    placeholder="john-doe"
                    name="uname"
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    name="email"
                    value={email}
                    onChange={(e) => setMail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <PasswordInput
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  onClick={SignupHandler}
                >
                  Create an account
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to={"/signin"} className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
