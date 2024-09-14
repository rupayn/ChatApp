import { Moon, SunMoon } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { darkMode, lightMode } from "../../../Store/ThemeSlice";
import { RootState } from "@/Store/Store";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function HeaderBar() {
  const [mode, setMode] = useState("Light");
  const dispatch = useDispatch();
  const thememd = useSelector((state: RootState) => state.theme);
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

  return (
    <div className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4">
      <Link to={"/"}>
        <h1 className="text-xl dark:text-white font-semibold">ChatApp</h1>
      </Link>
      <Button
        // variant="outline"
        onClick={ThemeSwitch}
        size="sm"
        className="ml-auto gap-1.5 text-sm"
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
