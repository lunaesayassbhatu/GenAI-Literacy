import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { CharacterMascot } from "./CharacterMascot";
import { CHARACTERS, getCharacterInfo } from "../data/charactersData";
import { getUserData, updateUserData, type CharacterId } from "../utils/userData";
import { useTheme } from "../utils/themeContext";

export function ChooseCharacter() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<CharacterId | null>(
    getUserData()?.selectedCharacter || null
  );

  const from = (location.state as { from?: string } | null)?.from || "/home";

  const handleContinue = () => {
    if (!selected) return;
    updateUserData({ selectedCharacter: selected });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-3" style={{ color: colors.textPrimary }}>
          Choose Your Character
        </h1>
        <p className="mb-10" style={{ color: colors.textSecondary }}>
          Pick who you'll play as before starting the Learning Lab or Games.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {CHARACTERS.map((c) => {
            const isSelected = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelected(c.id)}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all text-left"
                style={{
                  backgroundColor: colors.cardBackground,
                  border: isSelected ? `3px solid ${c.color}` : `2px solid ${colors.cardBorder}`,
                  boxShadow: isSelected ? `0 0 0 4px ${c.color}33` : undefined,
                }}
              >
                <CharacterMascot character={c.id} size={100} animate />
                <div className="flex flex-col items-center text-center gap-1">
                  <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                    {c.name}
                  </span>
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {c.tagline}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {selected && (
          <div
            className="mb-10 p-5 rounded-2xl text-left"
            style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}
          >
            <p className="font-bold mb-1" style={{ color: getCharacterInfo(selected).color }}>
              {getCharacterInfo(selected).name}'s story
            </p>
            <p style={{ color: colors.textSecondary }}>{getCharacterInfo(selected).story}</p>
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={!selected}
          className="px-10 py-4 rounded-xl text-lg font-bold transition-all disabled:opacity-40"
          style={{ backgroundColor: colors.accentGold, color: '#0D0508' }}
        >
          Continue
        </button>
      </main>
    </div>
  );
}
