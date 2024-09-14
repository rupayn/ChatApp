import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter,createRoutesFromElements,RouterProvider,Route} from 'react-router-dom'
import Layout from './Layout.tsx'
import App from './App.tsx'
import { Provider } from 'react-redux'
import {store} from './Store/Store.ts'

import {Account, Chat, GroupChat, Signin,Signup,ContactChat,GroupContactChat} from "./components/My/index.ts"
import { TooltipProvider } from '@radix-ui/react-tooltip'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route path='' element={<App/>}/>
      <Route path='signup' element={<Signup/>}/>
      <Route path='signin' element={<Signin/>}/>
      <Route path='account' element={<Account/>}/>
      <Route path='chat' element={<ContactChat/>}/>
      <Route path='groups' element={<GroupContactChat/>}/>
      <Route path='chat/:contact' element={<Chat/>}/>
      <Route path='groups/:cont' element={<GroupChat/>}/>
    </Route>
  )
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </TooltipProvider>
  </StrictMode>
);
