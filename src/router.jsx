import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Loader from "./components/ui/Loader";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Palette = lazy(() => import("./pages/Palette"));
const Components = lazy(() => import("./pages/Components"));
// const Dashboard = lazy(() =>
//   new Promise((r) => setTimeout(r, 10000)).then(
//     () => import("./pages/Dashboard"),
//   ),
// );

const router = createBrowserRouter([
  // Public route: no sidebar or navbar
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },

  // App routes: wrapped by App (which renders AppLayout)
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "palette", element: <Palette /> },
      { path: "components", element: <Components /> },
      { path: "about", element: <About /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
