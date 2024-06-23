import {
    createRootRoute,
    Link,
    Outlet,
    useNavigate,
    useLocation,
  } from "@tanstack/react-router";
  import { TanStackRouterDevtools } from "@tanstack/router-devtools";
  import { Toaster } from "react-hot-toast";
  import supabase from "../lib/supabase";
  import { Fragment, useEffect, useState } from "react";
  import { cn } from "../lib/utils.js";
  import { BackgroundDots } from "../components/backgroundDots";
  import kelantanImage from "../assets/kelantan.png";
  import pahangImage from "../assets/pahang.png";
  import terengganuImage from "../assets/terengganu.png";
  
  export const Route = createRootRoute({
    component: Root,
  });
  
  const links = [
    {
      to: "/",
      label: "Home",
      isProtected: false,
      showForAdmin: true,
      showForUser: true,
    },
    {
      to: "/catalog",
      label: "Catalog",
      isProtected: false,
      showForAdmin: true,
      showForUser: true,
    },
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      isProtected: true,
      showForAdmin: true,
      showForUser: false,
    },
    {
      to: "/planner",
      label: "Planner",
      isProtected: true,
      showForAdmin: false,
      showForUser: true,
    },
    {
      to: "/contact",
      label: "Contact",
      isProtected: false,
      showForAdmin: false,
      showForUser: true,
    },
    {
      to: "/about",
      label: "About",
      isProtected: false,
      showForAdmin: false,
      showForUser: true,
    },
  ];
  
  function Navbar() {
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const { pathname } = useLocation();
    const [role, setRole] = useState(null);
  
    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
  
        if (!session) {
          return;
        }
  
        supabase
          .from("role")
          .select("role")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data: { role } }) => {
            console.log(role);
            setRole(role);
          });
      });
  
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });
    }, []);
  
    const logout = async () => {
      await supabase.auth.signOut();
      setSession(null);
  
      navigate({ to: "/sign-in" });
    };
  
    let navbar = links.filter((link) => !link.isProtected);
  
    if (session && role === "admin") {
      navbar = links.filter((link) => link.showForAdmin == true);
    } else if (session && role === "user") {
      navbar = links.filter((link) => link.showForUser);
    }
  
    return (
      <nav className="flex justify-between items-center bg-orange-400 px-20 py-2">
        <Link to="/" className="hover:cursor-pointer flex items-center">
          <div className="flex flex-col text-2xl font-semibold items-start text-white">
            <span>Smart Tourist</span>
            <span>Guide Planner</span>
          </div>
          <div className="ml-4 flex flex-col justify-between h-14">
            <img src={pahangImage} alt="" width={30} />
            <img src={kelantanImage} alt="" width={30} />
            <img src={terengganuImage} alt="" width={30} />
          </div>
        </Link>
        <ul className="hidden md:flex space-x-8">
          {navbar.map((link, index) => {
            return (
              <Fragment key={index}>
                <Link
                  to={link.to}
                  className={cn(
                    "hover:cursor-pointer hover:border-b border-white text-white text-xl",
                    pathname === link.to && "border-b border-white",
                  )}
                >
                  {link.label}
                </Link>
              </Fragment>
            );
          })}
        </ul>
        {!session ? (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="px-5 py-2 rounded bg-gray-100 hover:bg-orange-500 hover:text-white"
            >
              <Link to="/sign-in">Sign In</Link>
            </button>
            <button
              type="button"
              className="px-5 py-2 rounded bg-gray-100 hover:bg-orange-500 hover:text-white"
            >
              <Link to="/sign-up">Sign up</Link>
            </button>
          </div>
        ) : (
          <div className="gap-2 flex">
            <Link
              to="/profile"
              className="px-5 py-2 rounded bg-gray-100 hover:bg-orange-500 hover:text-white"
            >
              Profile
            </Link>
            <button
              type="button"
              className="px-5 py-2 rounded bg-gray-100 hover:bg-orange-500 hover:text-white"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    );
  }
  
  function Root() {
    return (
      <>
        <Navbar />
        <div className="container mx-auto">
          <BackgroundDots />
          <Outlet />
          <Toaster />
        </div>
        <TanStackRouterDevtools />
      </>
    );
  }
  