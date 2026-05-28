import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            className: "rounded-full border border-white/50 bg-white/90 px-4 py-3 text-sm text-slate-800 shadow-lg",
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
