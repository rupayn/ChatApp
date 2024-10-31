
import { Outlet } from 'react-router-dom'
import { AsideBar, HeaderBar } from './components/My'
import axios from 'axios';
import { server } from './constant/config';
import { login } from './Store/AuthSlice';
// import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './Store/Store';

// import { logout } from './Store/AuthSlice';

function Layout() {
  const dispatch=useDispatch()
  
  const data = useSelector((state: RootState) => state.auth.userData);
  setTimeout(()=>{
    if (!data)
      axios
        .get(`${server}/api/user/me`, {
          withCredentials: true,
        })
        .then((res) => {
          dispatch(login(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
  },1000)
  
  return (
    <>
      <section className="bg-teal-500 dark:bg-cyan-900 max-h-screen ease-in-out overflow-hidden">
        <div className="grid h-screen w-full pl-[53px]">
          <AsideBar />
          <div className="flex flex-col">
            <HeaderBar />
            <Outlet />
          </div>
        </div>
      </section>
    </>
  );
}

export default Layout
