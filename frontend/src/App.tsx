import { useEffect } from "react";
import { Toaster } from "sonner";
import { AppRouter } from "./router";
import { Sidebar } from "./components/molecules/Sidebar";
import { useAuthStore } from "./store/useAuthStore";

export const App = () => {
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  return (
    <>
      <Sidebar />
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
};

export default App;
