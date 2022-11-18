import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./Routes/Routes/Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-[1440px] mx-auto">
        <RouterProvider router={router}></RouterProvider>
        <Toaster position="bottom-center"></Toaster>
      </div>
    </QueryClientProvider>
  );
}

export default App;
