import React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserDisplayName } from "../utils/displayName";

const SIDEBAR_LINK_CLASS =
  "rounded-lg px-3 py-2.5 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900";

function SidebarNavLink({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${SIDEBAR_LINK_CLASS} ${isActive ? "bg-blue-50 font-semibold text-blue-800" : "text-slate-600"}`
      }
    >
      {children}
    </NavLink>
  );
}

function BusinessInformationNavLink() {
  const { pathname } = useLocation();
  const active = pathname.startsWith("/business-profile");
  return (
    <Link
      to="/business-profile"
      className={`${SIDEBAR_LINK_CLASS} ${active ? "bg-blue-50 font-semibold text-blue-800" : "text-slate-600"}`}
    >
      Business Information
    </Link>
  );
}

export default function DashboardLayout() {
  const { user } = useAuth();
  const name = getUserDisplayName(user);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white md:w-56 md:border-b-0 md:border-r lg:w-60">
        <div className="border-b border-slate-100 px-5 py-6 md:border-0">
          <Link to="/dashboard" className="block text-[11px] font-semibold uppercase tracking-wider text-blue-600 hover:text-blue-700">
            Ledgex
          </Link>
          <p className="mt-2 truncate text-xs text-slate-500" title={user?.email}>
            {user?.email}
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:px-3 md:pb-8">
          <SidebarNavLink to="/dashboard/profile">Profile</SidebarNavLink>
          <SidebarNavLink to="/dashboard/accountant">Accountant</SidebarNavLink>
          <SidebarNavLink to="/dashboard/complaints">Complaints</SidebarNavLink>
          <SidebarNavLink to="/dashboard/companies">Companies</SidebarNavLink>
          <BusinessInformationNavLink />
          <SidebarNavLink to="/dashboard/settings">Settings</SidebarNavLink>
        </nav>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-6 py-6 shadow-sm shadow-slate-900/5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Welcome, {name}
          </h1>
        </header>
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
