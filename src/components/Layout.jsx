import { Outlet } from "react-router-dom";
import { useState, createContext } from "react";
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from '@stripe/react-stripe-js';

import Nav from "./Nav";
import Footer from "./Footer";
import SideBar from "./SideBar";

import { STRIPE_KEY } from "../utils/constants";

export const ToggleSidebarContext = createContext(null);

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState(null);
  const stripe = loadStripe(STRIPE_KEY)

  const toggleSidebar = (content) => {
    setIsSidebarOpen(!isSidebarOpen);
    setSidebarContent(content);
    if (content === null) setIsSidebarOpen(false)
  };

  return (
    <div className="relative min-h-lvh">
      <Nav toggleSidebar={ toggleSidebar } sidebarContent={ sidebarContent } />
      <div className="pb-[212px] pt-80">
        <ToggleSidebarContext.Provider value={ toggleSidebar }>
          <Elements stripe={ stripe }>
            <Outlet />
          </Elements>
        </ToggleSidebarContext.Provider>
        { isSidebarOpen && <SideBar className="w-[500px] overflow-y-scroll"> { sidebarContent } </SideBar> }
      </div>
      <Footer />
    </div>
  )
}

export default Layout;
