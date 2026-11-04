import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { CharacterMascot } from "./CharacterMascot";
import { StudentPortrait } from "./HeroStudent";
import { CHARACTERS, getCharacterInfo } from "../data/charactersData";
import { STUDENTS, getStudentInfo, resolveStudentId, type StudentId } from "../data/studentsData";
import { getUserData, updateUserData, type CharacterId } from "../utils/userData";
import { supabase } from "../utils/supabase";
import { hydrateLocalStorageFromSupabase } from "../utils/migrateToSupabase";
import { useTheme } from "../utils/themeContext";

export function ChooseCharacter() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<CharacterId | null>(
    getUserData()?.selectedCharacter || null
  );
  // The student for the home banner is a separate pick. Until one is chosen, the student that used to go with the character is shown.
  const [pickedStudent, setPickedStudent] = useState<StudentId | null>(
    getUserData()?.selectedStudent || null
  );
  const student = resolveStudentId(pickedStudent ?? undefined, selected ?? undefined) ?? null;

  const from = (location.state as { from?: string } | null)?.from || "/home";

  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const handleContinue = async () => {
    if (!selected || saving) return;
    setSaving(true);
    setSaveFailed(false);
    try {
      // This browser may have no saved profile yet (it is still loading, or the browser data was cleared). Saving a character needs one,
      // so load the real profile from the account first; never start an empty one, which could overwrite saved progress.
      if (!getUserData()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await hydrateLocalStorageFromSupabase(user.id, (user.email ?? "").toLowerCase());
          localStorage.setItem("hydrated_session", user.id);
        }
      }
      updateUserData({ selectedCharacter: selected, selectedStudent: student ?? undefined });
      if (getUserData()?.selectedCharacter === selected) {
        navigate(from, { replace: true });
        return;
      }
      setSaveFailed(true);
    } catch {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
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

        <section className="mb-10">
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            Choose Your Student
          </h2>
          <p className="text-sm mb-5" style={{ color: colors.textSecondary }}>
            Your student appears on the home banner.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STUDENTS.map((s) => {
              const isSelected = student === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setPickedStudent(s.id)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all text-left"
                  style={{
                    backgroundColor: colors.cardBackground,
                    border: isSelected ? `3px solid ${s.color}` : `2px solid ${colors.cardBorder}`,
                    boxShadow: isSelected ? `0 0 0 4px ${s.color}33` : undefined,
                  }}
                >
                  <StudentPortrait student={s.id} size={100} />
                  <div className="flex flex-col items-center text-center gap-1">
                    <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                      {s.name}
                    </span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      {s.studies}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {student && (
            <div
              className="mt-6 p-5 rounded-2xl text-left"
              style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}
            >
              <p className="font-bold mb-1" style={{ color: getStudentInfo(student).color }}>
                {getStudentInfo(student).name}'s story
              </p>
              <p style={{ color: colors.textSecondary }}>{getStudentInfo(student).story}</p>
            </div>
          )}
        </section>

        <button
          onClick={handleContinue}
          disabled={!selected || saving}
          className="px-10 py-4 rounded-xl text-lg font-bold transition-all disabled:opacity-40"
          style={{ backgroundColor: colors.accentGold, color: '#0D0508' }}
        >
          {saving ? "Saving..." : "Continue"}
        </button>
        {saveFailed && (
          <p role="alert" className="mt-4 text-sm font-semibold" style={{ color: "#ef4444" }}>
            We couldn't save your character. Check your connection, then press Continue again. If it keeps happening, sign out and sign back in.
          </p>
        )}
      </main>
    </div>
  );
}
