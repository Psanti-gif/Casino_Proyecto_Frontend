import{
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from 'react-router-dom'

import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import Create from "./pages/Create"
import Profile from "./pages/Profile"

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element ={<RootLayout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path="create" element ={<Create/>}/>
            <Route path ="profile" element = {<Profile/>}/>
        </Route>
        
    )
)

function App(){
    return(
        <RouterProvider router = {router}/> 
    )
}