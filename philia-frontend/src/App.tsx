import { ToastContainer } from "react-toastify";
import AppRouter from "./routes/AppRouter";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppRouter />
        </QueryClientProvider>
        <ToastContainer />
      </Provider>
    </>
  );
}

export default App;
