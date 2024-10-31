import {
  BadgeCheck,
  Bell,
  BellOff,
  CircleCheckBig,
  Moon,
  SquareX,
  SunMoon,
  UserPlus,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, useEffect, useState } from "react";

import { darkMode, lightMode } from "../../../Store/ThemeSlice";
import { RootState } from "@/Store/Store";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { server } from "@/constant/config";

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
interface searchUserType {
  _id: string;
  avatar: string;
  fname: string;
  uname: string;
}

interface notificationFrist {
  success: boolean;
  allRequests:[]
}

interface notificationSecond{
  _id: string;
  sender:{
    _id:  string,
    fname:  string,
    uname:  string,
    avatar: string
  }
}


function HeaderBar() {
  const userAvaiable = useSelector(
    (state: RootState) => state.auth.userData
  ) as UserInterface | null;
  const [mode, setMode] = useState("Light");
  const dispatch = useDispatch();
  const thememd = useSelector((state: RootState) => state.theme);
  // const[refectchNotification,setRefectchNotification]=useState(true)
  const [searchLoading,setSearchLoading]=useState(false);
  useEffect(() => {
    const rootElement = document.querySelector("#root");
    if (rootElement !== null) {
      rootElement.className = thememd.theme;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const ThemeSwitch = () => {
    if (mode == "Light") {
      setMode("Dark");
      dispatch(lightMode());
    } else {
      setMode("Light");
      dispatch(darkMode());
    }
  };
  const [Visible, setVisible] = useState("hidden");
  const [notifiactionUser, setNotifiactionUser] =
    useState < notificationFrist>();
  const [notificationCount, setNotificationCount] =useState(0)
  useEffect(() => {
    if (notifiactionUser === undefined) {
      axios
        .get(`${server}/api/user/notifications`, { withCredentials: true })
        .then((res) => {
          console.log(res);
          
          setNotifiactionUser(res.data);
          setNotificationCount(res.data.allRequests.length);
        })
        .catch((err) => {
          console.log(err.response?.data?.message);
        });
    }
  });
  const VisibleHandeler = async() => {
    setVisible((prev) => (prev === "Visible" ? "hidden" : "Visible"));
    if(Visible=="hidden") await axios.get(`${server}/api/user/notifications`,{withCredentials: true}).then((res)=>{
      setNotifiactionUser(res.data)
      
    }).catch((err) => {
      console.log(err.response?.data?.message);
    });
  };
  const [value, setValue] = useState("");
  const [SearchVisible, setSearchVisible] = useState("visible");
  const [searchedUsers,setSearchedUsers] = useState([])
  const [typing,setTyping] = useState(false)
  const [searchErr,setSearchErr]=useState(undefined)
  const changeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(String(e.target.value));
    setTyping(true)
  };
  useEffect(() => {
    if (value.length > 0) {
      setSearchVisible("visible");
    } else {
      setSearchVisible("hidden");
    }

    const fetchData = async () => {
      setSearchErr(undefined)
      setSearchLoading(true)
        const params={
          name:value
        }
         await axios.get(`${server}/api/user/search`,{
          withCredentials: true,
          params
         }).then((res)=>{
          setSearchLoading(false)
          setSearchedUsers(res.data.users);
         }).catch((err)=>{
          
            setSearchErr(err.response?.data?.message);
            alert(err.response?.data?.message);
            
         })
      
    }
     if (typing) {
       const typingTimeout = setTimeout(() => {
         fetchData();
         setTyping(false);
       }, 1000);

       return () => clearTimeout(typingTimeout);
     }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, setValue]);

  const [FriendRequestSent,setFriendRequestSent]=useState(false)

  const FrindRequestsend=(userId:string)=>{
    axios.put(`${server}/api/user/sendrequest`,{
      userId
    },{
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).then(()=>{
      setFriendRequestSent(true)
      setTimeout(()=>{
        setFriendRequestSent(false)
      },200)
    }).catch(err=>{
      alert(err.response?.data?.message);
    });
    
  }


  const handelAceptRequest = (requestId: string, accept:boolean) => {
    
    axios.put(`${server}/api/user/acceptrequest`, {
      requestId,
      accept,
    },{
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).then(()=>{
      axios
        .get(`${server}/api/user/notifications`, { withCredentials: true })
        .then((res) => {
          setNotifiactionUser(res.data);
          if (notificationCount)
            if (notificationCount > 0) {
              setNotificationCount((prev) => prev - 1);
            }
        })
        .catch((err) => {
          console.log(err.response?.data?.message);
        });
    }).catch((err) => {alert(err.response?.data?.message);})
  };

  return (
    <div className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
      <Link to={"/"}>
        <h1 className="text-xl dark:text-white font-semibold">ChatApp</h1>
      </Link>
      <div className={`${Visible} absolute bg-red-200 right-20 top-14`}>
        {notifiactionUser ? (
          notifiactionUser.allRequests.length === 0 ? (
            <div>No request Avaiable</div>
          ) : (
            notifiactionUser.allRequests.map(
              (request: notificationSecond, i) => (
                <div
                  key={i}
                  className="bg-red-400 flex justify-between items-center h-16 rounded-2xl w-full m-5 shadow-md"
                >
                  <img
                    src={`${request.sender.avatar}`}
                    alt=""
                    className="w-14 h-14 ml-2 rounded-full"
                  />
                  <div className="w-24">
                    <p className="font-bold leading-3">
                      {request.sender.fname}
                    </p>
                    <p>
                      <i>@{request.sender.uname}</i>
                    </p>
                  </div>
                  <Button
                    size={"sm"}
                    onClick={() => {
                      handelAceptRequest(request._id, false);
                    }}
                  >
                    <SquareX color="#ff0000" strokeWidth={3} />
                  </Button>
                  <Button
                    size={"sm"}
                    onClick={() => {
                      handelAceptRequest(request._id, true);
                    }}
                    className="mr-2"
                  >
                    <BadgeCheck color="#00ff00" strokeWidth={3} />
                  </Button>
                </div>
              )
            )
          )
        ) : (
          <div></div>
        )}
      </div>
      {searchLoading ? (
        <div>loading ....</div>
      ) : (
        <div
          className={`${SearchVisible} absolute bg-stone-600 dark:bg-teal-200 right-52 w-[30vw] top-14`}
        >
          {searchedUsers.length == 0 ? (
            <div>{searchErr ? searchErr : "User Not Found"}</div>
          ) : (
            searchedUsers.map((sUser: searchUserType, i) => (
              <div
                key={i}
                className="bg-red-400 flex justify-between items-center h-16 rounded-2xl w-full m-5 shadow-md"
              >
                <img
                  src={
                    sUser.avatar
                      ? `${sUser.avatar}`
                      : "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=2683&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt=""
                  className="w-14 h-14 ml-5 rounded-full"
                />
                <div className="w-72 flex flex-col items-center">
                  <p className="font-bold leading-3">
                    {sUser.fname ? sUser.fname : "name"}
                  </p>
                  <p>
                    <i>@{sUser.uname ? sUser.uname : "user name"}</i>
                  </p>
                </div>
                <Button
                  size={"sm"}
                  className="mr-5"
                  disabled={FriendRequestSent}
                  onClick={() => {
                    FrindRequestsend(sUser._id);
                  }}
                >
                  {!FriendRequestSent ? (
                    <UserPlus color="#00ff00" strokeWidth={3} />
                  ) : (
                    <CircleCheckBig />
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      )}
      {userAvaiable ? (
        <form className={`ml-auto mr-5 gap-1.5 max-w-md mx-auto`}>
          <div className="flex">
            <div className="relative w-[30vw]">
              <input
                onChange={(e) => changeSearch(e)}
                type="search"
                id="location-search"
                className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                placeholder="Find new Friends"
                required
              />
              <button
                type="submit"
                className="absolute top-0 end-0 h-full p-2.5 text-sm font-medium text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="ml-auto mr-5 gap-1.5 max-w-md mx-auto"></div>
      )}
      {userAvaiable ? (
        <Button className="mr-5 text-sm" onClick={VisibleHandeler}>
          {Visible === "hidden" ? <Bell /> : <BellOff />}
          <p className="text-xl font-bold ml-1">{notificationCount}</p>
        </Button>
      ) : (
        <div></div>
      )}

      <Button
        // variant="outline"
        onClick={ThemeSwitch}
        size="sm"
        className="px-4 h-8"
      >
        {mode == "Light" ? (
          <span className="flex items-center justify-between">
            <SunMoon />
            <p className="pl-2">{mode}</p>
          </span>
        ) : (
          <span className="flex items-center ease-in-out justify-between">
            <p className="pr-2">{mode}</p>
            <Moon />
          </span>
        )}
      </Button>
    </div>
  );
}

export default HeaderBar;
