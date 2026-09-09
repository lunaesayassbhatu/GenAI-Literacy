import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes.tsx";
import { ThemeProvider } from "./utils/themeContext";
import { AuthProvider, useAuth } from "./utils/authContext";
import { migrateLocalStorageToSupabase } from "./utils/migrateToSupabase";

function MigrationRunner() {
  const { session } = useAuth();
  useEffect(() => {
    if (session) migrateLocalStorageToSupabase();
  }, [session]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MigrationRunner />
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}