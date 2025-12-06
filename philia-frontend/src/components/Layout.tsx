import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { ErrorBoundary } from "react-error-boundary";
import Fallback from "../pages/Fallback";
// import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();
  return (
    <>
      <Header />
      <div className="fixed w-50 h-50 bg-green-500/20 blur-3xl rounded-full top-10 left-10 animate-pulse pointer-events-none"></div>
      <div className="fixed w-80 h-80 bg-blue-500/20 blur-3xl rounded-full top-60 right-10 animate-pulse pointer-events-none"></div>
      <ErrorBoundary
        FallbackComponent={Fallback}
        resetKeys={[location.pathname]}
      >
        <div className="flex-1 mt-25">
          <Outlet />
        </div>
      </ErrorBoundary>
      {/* <Footer /> */}
    </>
  );
}
