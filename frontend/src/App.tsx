import { Toaster } from "sonner";
import { Navbar } from "./components/layout";
import { AppRouter } from "./router";

export const App = () => {
  return (
    <>
      <Navbar />
      <AppRouter />
      <Toaster position="top-right" richColors />
    </>
  );
};

export default App;
