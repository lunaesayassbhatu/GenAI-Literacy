import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { GuideMascot } from "./GuideMascot";
import { StudentPortrait } from "./HeroStudent";
import { CHARACTERS, getCharacterInfo } from "../data/charactersData";
import { STUDENTS, getStudentInfo, resolveStudentId, type StudentId } from "../data/studentsData";
import { getUserData, updateUserData, type CharacterId } from "../utils/userData";
import { supabase } from "../utils/supabase";
import { hydrateLocalStorageFromSupabase } from "../utils/migrateToSupabase";
import { useTheme } from "../utils/themeContext";

// Two choices on one screen:
//  - the student who represents the learner (shown in the corner of every game and lesson, and on the home banner), and
//  - how Wave, the guide, looks: one of the animals. The animals used to be the learner's character; they now take the dolphin's place.
export function ChooseCharacter() {
  const { colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  // The animal is saved where the old character choice was kept, so existing learners keep their pick (as their guide).
  const [guide, setGuide] = useState<CharacterId | null>(getUserData()?.selectedCharacter || null);
  // A learner who had a character but never picked a student gets the student that used to go with it.
  const [student, setStudent] = useState<StudentId | null>(() => {
    const u = getUserData();
    return resolveStudentId(u?.selectedStudent, u?.selectedCharacter) ?? null;
  });

  const from = (location.state as { from?: string } | null)?.from || "/home";

  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  const handleContinue = async () => {
    if (!guide || !student || saving) return;
    setSaving(true);
    setSaveFailed(false);
    try {
      // This browser may have no saved profile yet (it is still loading, or the browser data was cleared). Saving a choice needs one,
      // so load the real profile from the account first; never start an empty one, which could overwrite saved progress.
      if (!getUserData()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await hydrateLocalStorageFromSupabase(user.id, (user.email ?? "").toLowerCase());
          localStorage.setItem("hydrated_session", user.id);
        }
      }
      updateUserData({ selectedCharacter: guide, selectedStudent: student });
      if (getUserData()?.selectedCharacter === guide) {
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
          Choose Your Avatar
        </h1>
        <p className="mb-10" style={{ color: colors.textSecondary }}>
          Pick the student who represents you, then pick how Wave, your guide, looks.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            1. This is you
          </h2>
          <p className="text-sm mb-5" style={{ color: colors.textSecondary }}>
            Your student shows up in the corner of every game and lesson, on your profile and on the home banner.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STUDENTS.map((s) => {
              const isSelected = student === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setStudent(s.id)}
                  aria-pressed={isSelected}
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

        <section className="mb-10">
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            2. Choose your guide
          </h2>
          <p className="text-sm mb-5" style={{ color: colors.textSecondary }}>
            Wave is your guide. Pick the animal Wave will look like when it helps you in lessons, games and the chat.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CHARACTERS.map((c) => {
              const isSelected = guide === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setGuide(c.id)}
                  aria-pressed={isSelected}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all text-left"
                  style={{
                    backgroundColor: colors.cardBackground,
                    border: isSelected ? `3px solid ${c.color}` : `2px solid ${colors.cardBorder}`,
                    boxShadow: isSelected ? `0 0 0 4px ${c.color}33` : undefined,
                  }}
                >
                  <GuideMascot guide={c.id} size={100} />
                  <div className="flex flex-col items-center text-center gap-1">
                    <span className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                      {c.animal}
                    </span>
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      Wave as {/^[aeiou]/i.test(c.animal) ? "an" : "a"} {c.animal.toLowerCase()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {guide && (
            <div
              className="mt-6 p-5 rounded-2xl text-left"
              style={{ backgroundColor: colors.cardBackground, border: `1px solid ${colors.cardBorder}` }}
            >
              <p className="font-bold mb-1" style={{ color: getCharacterInfo(guide).color }}>
                Lesson stories will star {getCharacterInfo(guide).name}
              </p>
              <p style={{ color: colors.textSecondary }}>
                {getCharacterInfo(guide).tagline}. {getCharacterInfo(guide).story}
              </p>
            </div>
          )}
        </section>

        <button
          onClick={handleContinue}
          disabled={!guide || !student || saving}
          className="px-10 py-4 rounded-xl text-lg font-bold transition-all disabled:opacity-40"
          style={{ backgroundColor: colors.accentGold, color: '#0D0508' }}
        >
          {saving ? "Saving..." : "Continue"}
        </button>
        {(!guide || !student) && (
          <p className="mt-3 text-sm" style={{ color: colors.textSecondary }}>
            {!student && !guide ? "Pick a student and a guide to continue." : !student ? "Pick a student to continue." : "Pick a guide to continue."}
          </p>
        )}
        {saveFailed && (
          <p role="alert" className="mt-4 text-sm font-semibold" style={{ color: "#ef4444" }}>
            We couldn't save your choices. Check your connection, then press Continue again. If it keeps happening, sign out and sign back in.
          </p>
        )}
      </main>
    </div>
  );
}
