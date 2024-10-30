import { RootState } from "@/Store/Store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ProtectedProps {
  children: React.ReactNode;
  authentication?: boolean;
}
export default function Protected({ children, authentication = true }:ProtectedProps) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state: RootState) => state.auth.UserStatus);

  useEffect(() => {
    //TODO: make it more easy to understand

    // if (authStatus ===true){
    //     navigate("/")
    // } else if (authStatus === false) {
    //     navigate("/login")
    // }

    //let authValue = authStatus === true ? true : false

    if (authentication && authStatus !== authentication) {
      navigate("/signin");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/chat");
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
