import { MessageCircle, MessagesSquare, SquareUser, UsersRound } from "lucide-react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Link, NavLink } from "react-router-dom";

function AsideBar() {
  return (
    <div className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
      <div className="border-b p-2">
        <Link to={"/"}>
          <Button variant="outline" size="icon" aria-label="Home">
            {/* <Triangle className="size-5 fill-foreground" /> */}
            <MessageCircle className="size-5 fill-foreground" />
          </Button>
        </Link>
      </div>
      <nav className="grid gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink to="/chat">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="icon"
                  // rounded-lg bg-muted
                  className={`rounded-lg ${isActive ? "bg-muted" : ""}`}
                  aria-label="Playground"
                >
                  <MessagesSquare className="size-5" />
                </Button>
              )}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Chats
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink to="/groups">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="icon"
                  // rounded-lg bg-muted
                  className={`rounded-lg ${isActive ? "bg-muted" : ""}`}
                  aria-label="Playground"
                >
                  <UsersRound />
                </Button>
              )}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Groups
          </TooltipContent>
        </Tooltip>
        
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink to="/account">
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-lg mt-auto ${isActive ? "bg-muted" : ""}`}
                  aria-label="Account"
                >
                  <SquareUser className="size-5" />
                </Button>
              )}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={5}>
            Account
          </TooltipContent>
        </Tooltip>
      </nav>
    </div>
  );
}

export default AsideBar;
