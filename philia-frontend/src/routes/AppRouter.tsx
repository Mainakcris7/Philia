import {
  createBrowserRouter,
  RouterProvider,
  ScrollRestoration,
} from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import FriendRequests from "../pages/FriendRequests";
import Search from "../pages/Search";
import Notifications from "../pages/Notifications";
import ProtectedRoutes from "../components/ProtectedRoutes";
import Profile from "../pages/Profile";
import AuthRoutes from "../components/AuthRoutes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserProfile from "../pages/UserProfile";
import Post from "../pages/Post";
import Trending from "../pages/Trending";
import Friends from "../pages/Friends";
import SearchResult from "../components/SearchResult";
import PageNotFound from "../pages/PageNotFound";

export default function AppRouter() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Layout />
          <ScrollRestoration />
        </>
      ),
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "/search",
          element: <Search />,
          children: [
            {
              path: "all",
              element: <SearchResult />,
            },
            {
              path: "users",
              element: <SearchResult />,
            },
            {
              path: "posts",
              element: <SearchResult />,
            },
          ],
        },
        {
          path: "/trending",
          element: <Trending />,
        },
        {
          path: "/users/:userId",
          element: <UserProfile />,
        },
        {
          path: "/posts/:postId",
          element: <Post />,
        },
        {
          path: "/friend-requests",
          element: <FriendRequests />,
        },
        {
          path: "/notifications",
          element: <Notifications />,
        },
        {
          element: <ProtectedRoutes />,
          children: [
            {
              path: "/profile",
              element: <Profile />,
            },
            {
              path: "/users/:userId/friends",
              element: <Friends />,
            },
          ],
        },
        {
          path: "/auth",
          element: <AuthRoutes />,
          children: [
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
            },
          ],
        },
        {
          path: "*",
          element: <PageNotFound />,
        },
      ],
    },
  ]);
  return <RouterProvider router={routes} />;
}
