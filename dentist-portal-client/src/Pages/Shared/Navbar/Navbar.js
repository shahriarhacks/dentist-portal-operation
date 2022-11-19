import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const handleLogOut = () => {
    logOut()
      .then(() => {})
      .catch((err) => console.log(err));
  };

  const menuItems = (
    <React.Fragment>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/appointment">Appointment</NavLink>
      </li>
      <li>
        <NavLink to="/about">About</NavLink>
      </li>
      {user?.uid ? (
        <>
          <li>
            <NavLink to="/dashboard">Dashboard</NavLink>
          </li>
          <li>
            <button onClick={handleLogOut}>Sign out</button>
          </li>
        </>
      ) : (
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      )}
    </React.Fragment>
  );

  return (
    <div className="navbar bg-base-100 flex justify-between">
      <div className="navbar-start">
        <>
          <label
            htmlFor="dashboard-drawer"
            tabIndex={1}
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </label>
        </>
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Dentist Portal
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">{menuItems}</ul>
      </div>
      <div className="dropdown dropdown-end dropdown-hover">
        <label tabIndex={0} className="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
        >
          {menuItems}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
