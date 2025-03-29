import React from "react";
import Navbar from "./component/Header/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "./component/Header/Sidebar";

function Layout() {
    return (
        <>
            <Navbar />
            <div className="sm:flex flex-none">
                <div className="">
                    <Sidebar />
                </div>
                <div className="sm:flex-1">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Layout;