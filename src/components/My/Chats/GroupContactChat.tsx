import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

function GroupContactChat({ className = "visible" }) {
  // let arr=[];
  // for (let i=0; i<50; i++) {
  //   arr.push(<div className="flex items-center mb-2 gap-4 rounded-xl border h-16">
  //             <img
  //               className="w-12 ml-2 h-12 bg-auto inline-block rounded-full "
  //               src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=2683&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  //               alt=""
  //             />
  //             <h1>Name {i}</h1>
  //           </div>)
  // }
  const id = 1;
  return (
    <div
      className={`relative ${className} flex-col items-start gap-8 md:flex `}
      x-chunk="dashboard-03-chunk-0"
    >
      <div className="grid  md:min-w-[30rem] overflow-hidden max-h-screen min-h-screen items-start">
        <fieldset className="grid gap-6 max-h-[88vh] min-h-[88%] rounded-lg border p-4 overflow-hidden overflow-y-scroll">
          <legend className="-ml-1 px-1 text-sm font-medium">Messages</legend>
          <div id="contactChat" className="overflow-y-scroll min-h-[100%]">
            <NavLink to={`/groups/${id}`}>
              <div className="flex items-center mb-2 gap-4 rounded-xl border h-16">
                <img
                  className="w-12 ml-2 h-12 bg-auto inline-block rounded-full "
                  src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=2683&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt=""
                />
                <h1>Name</h1>
              </div>
            </NavLink>
          </div>
        </fieldset>
        <Button className="absolute h-12 left-64 md:left-[25rem] bottom-28">
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
            className="lucide lucide-user-plus"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
export default GroupContactChat;
