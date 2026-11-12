import { StudentBust } from "./HeroStudent";
import { getUserData } from "../utils/userData";
import { getEquippedItemIds } from "../utils/itemsSystem";
import { resolveStudentId } from "../data/studentsData";

/**
 * The learner's own avatar: the student they chose, wearing whatever accessories they have equipped.
 * Used in the corner of the games and lessons, on the journey map and in the Learning Lab.
 * (The animals are no longer the learner. They are the choices for Wave, the guide: see GuideMascot.)
 */
export function PlayerAvatar({ size = 64 }: { size?: number }) {
  const user = getUserData();
  // A learner who has not picked a student yet gets the one that used to go with their saved character.
  const student = resolveStudentId(user?.selectedStudent, user?.selectedCharacter);
  if (!student) return null;
  return <StudentBust student={student} size={size} equipped={getEquippedItemIds()} />;
}
