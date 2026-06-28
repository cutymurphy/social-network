import { Navbar } from './components/layout';
import { AppRouter } from './router';

export const App = () => {
  return (
    <>
      <Navbar />
      <AppRouter />
    </>
  );
};

export default App;
