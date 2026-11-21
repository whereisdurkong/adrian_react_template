import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Loader from "../ui/Loader";
import styles from "../../styles/layout/AppLayout.module.css";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile sidebar whenever the page changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className={styles.root}>
      <Sidebar open={sidebarOpen} />

      <div className={styles.shell}>
        <div className={styles.panel}>
          <Navbar onToggleSidebar={() => setSidebarOpen((o) => !o)} />
          <main className={styles.main}>
            <div className={styles.content}>
              <Suspense fallback={<Loader label="Loading please wait" />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
