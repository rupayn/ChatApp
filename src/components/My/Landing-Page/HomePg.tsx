import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function HomePg() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="backdrop-blur-md flex flex-col justify-center items-center bg-white/60 rounded-3xl dark:bg-white/30 h-[80%] w-[80%]">
        <h1 className=" md:text-3xl text-xl mt-3 font-bold">Welcome to ChatApp</h1>
        <p className="w-8/12 mt-8 overflow-scroll md:min-h-20">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis
          officiis placeat nobis veritatis ab culpa recusandae provident
          repudiandae temporibus repellendus? Corporis assumenda illo officiis
          sapiente non optio quas nobis quae. Voluptas veniam earum dolores
          tempora, non mollitia id ducimus vel, eaque nobis corrupti nostrum
          fugiat illo reprehenderit quo! Nihil tenetur sint nisi aliquam fuga
          eaque alias voluptate laborum perferendis vitae!
        </p>
        <span className="text-lg mt-8 md:mt-16 md:mb-10  font-extrabold">
          Please Login to continue
        </span>
        <Link to={"/signin"}>
          <Button
            className="dark:bg-cyan-400 w-36 h-12 dark:hover:bg-white text-xl font-bold hover:bg-slate-950 bg-sky-800 my-4"
            variant={"default"}
          >
            Log in
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default HomePg
