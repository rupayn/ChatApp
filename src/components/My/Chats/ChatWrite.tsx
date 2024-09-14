/* eslint-disable @typescript-eslint/no-explicit-any */
import { Forward, Paperclip } from "lucide-react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

function ChatWrite({isGrp=false}) {
  const sendMsg = (e: any) => {
    e.preventDefault();
    console.log(file)
    setFile("");
  };
  const [visible,setVisible]=useState(true)
  const [file, setFile] = useState("");

  const visibleFile=()=>{
    setVisible((prev)=>!prev)
  }
  // const arr=[];
  // for (let i = 0; i <20; i++) {
  //   arr.push(
  //     <div className="max-w-72 mb-4 relative -right-2/3 text-wrap py-2 px-2 bg-green-200 rounded-xl ">
  //         {isGrp === true ? (
  //           <h1 className="text-violet-900">Name</h1>
  //         ) : (
  //           <div></div>
  //         )}
  //         Lorem ipsum dolor sit
  //       </div>
  //   )
  // }
const chatContainerRef = useRef(null);

//  const [msg,setMsg]=useState([])

const handleChange=(e:any) =>{
  setFile(URL.createObjectURL(e.target.files[0]));
  setVisible((prev) => !prev);
}
const cut = () => {
  setFile("");
  
};

useEffect(() => {
  if (chatContainerRef.current) {
    (chatContainerRef.current as HTMLElement).scrollTop = (chatContainerRef.current as HTMLElement).scrollHeight;
}
}, []);
  return (
    <div className="relative flex h-[90vh] md:h-[88%] flex-col rounded-xl bg-muted/50 border-transparent border-4  ring-offset-8 p-4 lg:col-span-2">
      {/* <Badge  className="absolute left-3 top-3">
                Name
              </Badge> */}
      <div className="bg-slate-700  text-white dark:text-black dark:bg-slate-300 h-14 flex items-center  rounded-3xl">
        <img
          className="w-12 h-12 bg-auto ml-4 inline-block rounded-full "
          src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=2683&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="img"
        />
        <h1 className="inline-block pl-4 font-bold">Name</h1>
      </div>
      <div ref={chatContainerRef} className="mt-8 max-h-96 overflow-scroll">
        <div className="max-w-72 mb-4 relative  text-wrap py-2 px-2 bg-red-100 rounded-xl ">
          {isGrp === true ? (
            <h1 className="text-violet-900">Name</h1>
          ) : (
            <div></div>
          )}
          Lorem ipsum dolor $ sit
        </div>
        <div className="max-w-72 mb-4 relative -right-2/3 text-wrap py-2 px-2 bg-green-200 rounded-xl ">
          {isGrp === true ? (
            <h1 className="text-violet-900">Name</h1>
          ) : (
            <div></div>
          )}
          Lorem ipsum dolor sit
        </div>
        <div className="max-w-72 mb-4 relative  text-wrap py-2 px-2 bg-red-100 rounded-xl ">
          {isGrp === true ? (
            <h1 className="text-violet-900">Name</h1>
          ) : (
            <div></div>
          )}
          Lorem ipsum dolor sit
        </div>
        <div className="max-w-72 mb-4 relative -right-2/3 text-wrap py-2 px-2 bg-green-200 rounded-xl ">
          {isGrp === true ? (
            <h1 className="text-violet-900">Name</h1>
          ) : (
            <div></div>
          )}
          Lorem ipsum dolor sit
        </div>
        {/* {arr} */}
      </div>
      <div className="flex-1" />
      <img src={file} alt="" className="w-24 md:w-72 lg:absolute lg:left-64 top-20" onClick={cut} />
      <div
        className={
          visible
            ? "hidden"
            : "relative flex flex-col justify-center  items-center bg-zinc-400 bottom-1 h-40  w-52"
        }
      >
        <div className="flex mt-2 items-center justify-around h-1/2 w-full">
          <Button
            size={"default"}
            className={`px-0 py-0 h-16 w-16 mb-2 rounded-full`}
          >
            <Input
              type="file"
              className="hidden"
              accept=".jpg,.png"
              id="img"
              required
              onChange={handleChange}
            />
            <Label
              htmlFor="img"
              className="w-full h-full rounded-full flex justify-center items-center "
            >
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
                className="lucide lucide-image"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
            </Label>
          </Button>
          <Button
            size={"default"}
            className={`px-0 py-0 h-16 w-16 mb-2 rounded-full`}
          >
            <Input
              type="file"
              className="hidden"
              accept=".mp4"
              id="vid"
              onChange={handleChange}
              required
            />
            <Label
              htmlFor="vid"
              className="w-full h-full rounded-full flex justify-center items-center "
            >
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
                className="lucide lucide-file-video-2"
              >
                <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <rect width="8" height="6" x="2" y="12" rx="1" />
                <path d="m10 15.5 4 2.5v-6l-4 2.5" />
              </svg>
            </Label>
          </Button>
        </div>
        <div className="flex items-center justify-around w-full h-1/2">
          <Button
            size={"default"}
            className={`px-0 py-0 h-16 w-16 mb-2 rounded-full`}
          >
            <Input
              type="file"
              className="hidden"
              accept=".mp3,.mpeg"
              id="aud"
              onChange={handleChange}
              required
            />
            <Label
              htmlFor="aud"
              className="w-full h-full rounded-full flex justify-center items-center "
            >
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
                className="lucide lucide-file-audio"
              >
                <path d="M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0" />
              </svg>
            </Label>
          </Button>
          <Button
            size={"default"}
            className={`px-0 py-0 h-16 w-16 mb-2 rounded-full`}
          >
            <Input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.pptx"
              id="doc"
              onChange={handleChange}
              required
            />
            <Label
              htmlFor="doc"
              className="w-full h-full rounded-full flex justify-center items-center "
            >
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
                className="lucide lucide-file-text"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                <path d="M10 9H8" />
                <path d="M16 13H8" />
                <path d="M16 17H8" />
              </svg>
            </Label>
          </Button>
        </div>
      </div>

      <form
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        x-chunk="dashboard-03-chunk-1"
        onSubmit={(e) => {
          sendMsg(e);
        }}
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Input
          type="text"
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0 dark:text-white"
        />

        <div className="flex items-center p-3 pt-0 dark:text-white">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={visibleFile} size="icon">
                <Paperclip className="size-4" />
                <span className="sr-only">Attach file</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Attach File</TooltipContent>
          </Tooltip>

          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            <Forward />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChatWrite;
