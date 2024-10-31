import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "../Auth/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Store/Store";
import axios from "axios";
import { server } from "@/constant/config";
import { logout } from "@/Store/AuthSlice";

interface Avatar {
  public_id: string;
  public_url: string;
}

interface UserInterface {
  avatar: Avatar;
  _id: string;
  fname: string;
  uname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
function Account() {
  const[disable,setDisable]=useState(true);
  const [successAlert,setSuccessAlert]=useState(false);
  const [failedAlert,setFailedAlert]=useState(false);
  const UserDetails = useSelector(
    (state: RootState) => state.auth.userData
  ) as UserInterface | null;
  const [loading, setLoading] = useState(false);
  
  const lnk = UserDetails?UserDetails.avatar.public_url:`https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=2683&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
   const [password, setPassword] = useState("");
  const [file, setFile] = useState(lnk);
  const[newFile,setNewFile]=useState(undefined);
  const [fname, setName] = useState(`${UserDetails?UserDetails.fname:"Name" }`);
  const [email, setMail] = useState(
    `${UserDetails?UserDetails.email:"email@gamil.com"}`
  );
  const [errorSave,setErrSave]=useState("")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChange(e: any) {
    setFile(URL.createObjectURL(e.target.files[0]));    
    setNewFile(e.target.files[0])
  }
  const dispatch = useDispatch()
  
  const editFun=(e: { preventDefault: () => void; })=>{
    e.preventDefault(); 
    if(disable==false){  
      setLoading(true)
      console.log(email,password,fname)
      axios.put(
          `${server}/api/user/renameuser`,
          { fname, email, password, avatar: newFile },
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then(() => {
          setLoading(false)
          setSuccessAlert(true);
          setTimeout(() => {
            setSuccessAlert(false);
          }, 2000);
        })
        .catch((er) => {
          setLoading(false);
          setFailedAlert(true);
          console.log(er.Resonse);

          setErrSave(er.message);
          setTimeout(() => {
            setFailedAlert(false);
          }, 2000);
        });
      }
    setDisable((prev)=>!prev)
  }
  const logoutHandler=()=>{
    axios.get(`${server}/api/auth/logout`,{withCredentials:true}).then(()=>{
      dispatch(logout())
    });
  }
  // console.log("user",UserDetails)
  
  // useEffect(() => {
  //   // if name and set mail != prev update db
  //   axios.get(`${server}/api/user/me`).then((res) => {
  //     dispatch(login(res.data))
  //   });
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [setNewFile,newFile]);
  return (
    <div className="flex w-full h-full flex-col justify-center items-center bg">
      {successAlert ? (
        <motion.div
          className="relative  md:-right-[40%]"
          initial={{ opacity: 0, scale: 0.5, right: "-100%" }}
          animate={{ opacity: 1, scale: 1, right: "-40%" }}
          transition={{
            duration: 2,
            repeat: 1,
            repeatType: "reverse",
            repeatDelay: 2,
          }}
        >
          <Alert className="w-44  relative md:-right-[40%]">
            <AlertTitle className="inline-block mr-2">Saved </AlertTitle>✅
          </Alert>
        </motion.div>
      ) : (
        <div></div>
      )}
      {failedAlert ? (
        <div className="h-10 w-64 bg-red-300 ml-5 rounded-xl mb-4 flex items-center justify-center font-extrabold ">
          <p>not saved ❌ {errorSave}</p>
        </div>
      ) : (
        <div></div>
      )}
      <img
        className="w-64 ml-2 h-64 bg-auto mb-5 inline-block rounded-full "
        src={file}
        alt=""
      />
      <Button
        size={"sm"}
        className={disable ? "hidden" : `relative -top-10  px-0 py-0 mb-2`}
      >
        <Input
          type="file"
          className="hidden"
          accept=".jpg,.png,.jpeg"
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
      <div className="flex flex-col ">
        <form onSubmit={editFun}>
          <Button
            type="submit"
            className="relative my-5 md:my-0 -right-32 md:-right-full"
          >
            {disable ? <Pencil /> : <Save />}
          </Button>
          <Input
            type="text"
            disabled={disable}
            className="text-center block bg-transparent border-none text-2xl disabled:cursor-default disabled:opacity-100"
            value={fname}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            disabled={disable}
            className="text-center mb-4  bg-transparent border-none text-2xl disabled:cursor-default disabled:opacity-100"
            value={email}
            onChange={(e) => setMail(e.target.value)}
          />
          <label htmlFor="pass" className={disable ? "hidden" : ""}>
            Change Password
          </label>

          <PasswordInput
            id="pass"
            className={disable ? "hidden" : "mb-5"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </form>
        <Button
          className={disable ? "hover:bg-red-600" : "hidden"}
          variant={"destructive"}
          onClick={logoutHandler}
          disabled={loading}
        >
          Log Out
        </Button>
        {loading?<div className="text-center mt-5 font-serif font-extrabold text-3xl">Updating your data ...</div>:<div></div>}
      </div>
    </div>
  );
}

export default Account
