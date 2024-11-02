import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Layout from './Layout.tsx'
import App from './App.tsx'
import { Provider } from 'react-redux'
import {store} from './Store/Store.ts'
import AuthLayout from "./components/My/ProtectRoute/AuthLayout.tsx"
import {Account, Chat, GroupChat, Signin,Signup,ContactChat,GroupContactChat} from "./components/My/index.ts"
import { TooltipProvider } from '@radix-ui/react-tooltip'
import { SocketProvider } from './socket.tsx'


const router = createBrowserRouter(
  // createRoutesFromElements(
  //   <Route path='/' element={<Layout/>}>
  //     <Route path='' element={<App/>}/>
  //     <Route path='signup' element={<Signup/>}/>
  //     <Route path='signin' element={<Signin/>}/>
  //     <Route path='account' element={<Account/>}/>
  //     <Route path='chat' element={<ContactChat/>}/>
  //     <Route path='groups' element={<GroupContactChat/>}/>
  //     <Route path='chat/:contact' element={<Chat/>}/>
  //     <Route path='groups/:cont' element={<GroupChat/>}/>
  //   </Route>
  // )
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <App />,
        },
        {
          path: "signup",
          element: (
            <AuthLayout authentication={false}>
              <Signup />
            </AuthLayout>
          ),
        },
        {
          path: "signin",
          element: (
            <AuthLayout authentication={false}>
              <Signin />
            </AuthLayout>
          ),
        },
        {
          path: "account",
          element: (
            <AuthLayout authentication>
              <Account />
            </AuthLayout>
          ),
        },
        {
          path: "chat",
          element: (
            <SocketProvider>
              <AuthLayout authentication>
                <ContactChat />
              </AuthLayout>
            </SocketProvider>
          ),
        },
        {
          path: "groups",
          element: (
            <SocketProvider>
              <AuthLayout authentication>
                <GroupContactChat />
              </AuthLayout>
            </SocketProvider>
          ),
        },
        {
          path: "chat/:contact",
          element: (
            <SocketProvider>
              <AuthLayout authentication>
                <Chat />
              </AuthLayout>
            </SocketProvider>
          ),
        },
        {
          path: "groups/:cont",
          element: (
            <SocketProvider>
              <AuthLayout authentication>
                <GroupChat />
              </AuthLayout>
            </SocketProvider>
          ),
        },
      ],
    },
  ]
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </TooltipProvider>
  </StrictMode>
);
