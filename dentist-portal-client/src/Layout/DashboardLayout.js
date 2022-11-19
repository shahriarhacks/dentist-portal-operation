import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../Pages/Shared/Navbar/Navbar";

const DashboardLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="drawer drawer-mobile">
        <input
          id="dashboard-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content ">
          {/* <!-- Page content here --> */}
          <Outlet />
          {/* <label
            htmlFor="dashboard-drawer"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open drawer
          </label> */}
        </div>
        <div className="drawer-side">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-base-100 text-base-content">
            {/* <!-- Sidebar content here --> */}
            <li>
              <NavLink>Appointments</NavLink>
            </li>
            <li>{/* <NavLink>Sidebar Item 2</NavLink> */}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
