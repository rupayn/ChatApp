import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "../Auth/PasswordInput";

function Account() {
  const[disable,setDisable]=useState(true);
  const[name,setName]=useState("Name")
  const[mail,setMail]=useState("email@gamil.com")
  const[password,setPassword]=useState("")
  const lnk = `https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=2683&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;
  const [file, setFile] = useState(lnk);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChange(e: any) {
    setFile(URL.createObjectURL(e.target.files[0]));
  }
  const editFun=(e: { preventDefault: () => void; })=>{
    e.preventDefault();
    setDisable((prev)=>!prev)
  }
  useEffect(() => {
    // if name and set mail != prev update db
  }, [setDisable]);
  return (
    <div className="flex w-full h-full flex-col justify-center items-center bg">
      {disable ? (
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            disabled={disable}
            className="text-center mb-4  bg-transparent border-none text-2xl disabled:cursor-default disabled:opacity-100"
            value={mail}
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
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}

export default Account
