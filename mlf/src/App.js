import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { SongProvider } from "./context/SongContext";

function App() {
  return (
    <AuthProvider>
      <SongProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SongProvider>
    </AuthProvider>
  );
}

export default App;