import { Toaster } from "sonner";
import { AppRouter } from "./router";
import { Sidebar } from "./components/molecules/Sidebar";

export const App = () => {
  return (
    <>
      <Sidebar />
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
};

export default App;
