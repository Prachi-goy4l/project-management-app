import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
     <ThemeProvider>
    <AuthProvider>
      <App />
      <Toaster richColors position="top-right" />
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);