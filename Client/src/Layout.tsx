import { Outlet } from 'react-router-dom'
import { AsideBar, HeaderBar } from './components/My'

function Layout() {
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
