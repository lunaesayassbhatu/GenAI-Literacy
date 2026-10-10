import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./utils/authContext";
import { getUserData } from "./utils/userData";
import { AskWaveChat } from "./components/AskWaveChat";
import { Login } from "./components/Login";
import { ResetPassword } from "./components/ResetPassword";
import { HomePage } from "./components/HomePage";
import { LearningLab } from "./components/LearningLab";
import { Games } from "./components/Games";
import { MatchingGame } from "./components/MatchingGame";
import { Profile } from "./components/Profile";
import { ModuleLearning } from "./components/ModuleLearning";
import { ChooseCharacter } from "./components/ChooseCharacter";
import { JourneyMap } from "./components/JourneyMap";
import { EthicsMatchingGame } from "./components/games/EthicsMatchingGame";
import { FactOrMythGame } from "./components/games/FactOrMythGame";
import { BuildAPromptGame } from "./components/games/BuildAPromptGame";
import { PromptSandboxGame } from "./components/games/PromptSandboxGame";
import { BiasMatchingGame } from "./components/games/BiasMatchingGame";
import { BlackBoxMatchingGame } from "./components/games/BlackBoxMatchingGame";
import { EnvironmentGame } from "./components/games/EnvironmentGame";
import { BankPortalGame } from "./components/games/BankPortalGame";
import { KingsNotebookGame } from "./components/games/KingsNotebookGame";
import { DungeonCrawlGame } from "./components/games/DungeonCrawlGame";
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

// Requires a chosen character before reaching Learning Lab / Games
const CharacterRequiredRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const hasCharacter = Boolean(getUserData()?.selectedCharacter);

  if (!hasCharacter) return <Navigate to="/choose-character" state={{ from: location.pathname }} replace />;

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
    path: "/reset-password",
    element: <ResetPassword />
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
    path: "/choose-character",
    element: (
      <ProtectedRoute>
        <ChooseCharacter />
      </ProtectedRoute>
    )
  },
  {
    path: "/map",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <JourneyMap />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/learning-lab",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <LearningLab />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/module/:moduleId",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <ModuleLearning />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/games",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <Games />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/game/matching",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <MatchingGame />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/games/ethics",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <EthicsMatchingGame />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/games/fact-or-myth",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <FactOrMythGame />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/games/build-a-prompt",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <BuildAPromptGame />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/games/sandbox",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <PromptSandboxGame />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/games/bias",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <BiasMatchingGame />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/games/black-box",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <BlackBoxMatchingGame />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/games/environment",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <EnvironmentGame />
        </CharacterRequiredRoute>
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
  // SHOWCASE ONLY — narrative-world game concepts (see World & Brainstorm doc).
  // Reachable directly for demo purposes; deliberately not added to the Games
  // hub or Journey Map since no world has been chosen yet.
  {
    path: "/showcase/bank-portal",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <BankPortalGame />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/showcase/kings-notebook",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <KingsNotebookGame />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "/showcase/dungeon-crawl",
    element: (
      <ProtectedRoute>
        <CharacterRequiredRoute>
          <DungeonCrawlGame />
        </CharacterRequiredRoute>
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
  ]},
]);
