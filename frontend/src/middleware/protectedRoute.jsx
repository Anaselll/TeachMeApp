import {  useContext } from "react"
import {AuthContext} from '../context/AuthContext'
import { Navigate, useNavigate } from "react-router-dom"

export default function ProtectedRoute({children,allow}){
    const redirect=useNavigate()
    const { user } = useContext(AuthContext);
    if (!user) {
      return <Navigate to="/login" />;
    }
    if(allow && allow!=user.role){
      return  redirect('/login')   
    }
    console.log(user)
    
    return children
}