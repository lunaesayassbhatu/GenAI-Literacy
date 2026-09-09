import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./utils/authContext";
import { getUserData } from "./utils/userData";
import { AskWaveChat } from "./components/AskWaveChat";
import { Login } from "./components/Login";
import { HomePage } from "./components/HomePage";
import { LearningLab } from "./components/LearningLab";
import { Games } from "./components/Games";
import { MatchingGame } from "./components/MatchingGame";
import { Profile } from "./components/Profile";
import { ModuleLearning } from "./components/ModuleLearning";
import { EthicsMatchingGame } from "./components/games/EthicsMatchingGame";
import { FactOrMythGame } from "./components/games/FactOrMythGame";
import { BuildAPromptGame } from "./components/games/BuildAPromptGame";
import { PromptSandboxGame } from "./components/games/PromptSandboxGame";
import { ScrollToTop } from "./components/ScrollToTop";

function RootLayout() {
  const hasUser = Boolean(getUserData());
  return (
    <>
      <ScrollToTop />
      <Outlet />
      {hasUser && <AskWaveChat />}
    </>
  );
}

// Auth guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    )
  },
  {
    path: "/learning-lab",
    element: (
      <ProtectedRoute>
        <LearningLab />
      </ProtectedRoute>
    )
  },
  {
    path: "/module/:moduleId",
    element: (
      <ProtectedRoute>
        <ModuleLearning />
      </ProtectedRoute>
    )
  },
  {
    path: "/games",
    element: (
      <ProtectedRoute>
        <Games />
      </ProtectedRoute>
    )
  },
  {
    path: "/game/matching",
    element: (
      <ProtectedRoute>
        <MatchingGame />
      </ProtectedRoute>
    )
  },
  {
    path: "/games/ethics",
    element: (
      <ProtectedRoute>
        <EthicsMatchingGame />
      </ProtectedRoute>
    )
  },
  {
    path: "/games/fact-or-myth",
    element: (
      <ProtectedRoute>
        <FactOrMythGame />
      </ProtectedRoute>
    )
  },
  {
    path: "/games/build-a-prompt",
    element: (
      <ProtectedRoute>
        <BuildAPromptGame />
      </ProtectedRoute>
    )
  },
  {
    path: "/games/sandbox",
    element: (
      <ProtectedRoute>
        <PromptSandboxGame />
      </ProtectedRoute>
    )
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
  ]},
]);
