import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { LiveActivity } from "./LiveActivity";
import { DevNotes } from "./DevNotes";
import { motion, AnimatePresence } from "motion/react";

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary/30 selection:text-primary">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="flex-grow pt-20"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <LiveActivity />
      <DevNotes />
      <Footer />
    </div>
  );
}
