import { Outlet } from "react-router-dom";
import Header from './components/header'
export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      <Header /> 
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
