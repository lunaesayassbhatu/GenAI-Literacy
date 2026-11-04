import type { CharacterId } from "../utils/userData";

export type StudentId = "maya" | "malik" | "sam";

export interface StudentInfo {
  id: StudentId;
  name: string;
  /** What they study, shown under their name on the character screen. */
  studies: string;
  color: string;
  /** Short description shown once they are picked, like each character's story. */
  story: string;
}

// The students a learner can pick for the home banner. They are separate people from the
// animal characters (and from the people in the lesson stories), so they have their own names.
export const STUDENTS: StudentInfo[] = [
  {
    id: "maya",
    name: "Maya",
    studies: "Junior Journalism Student at ASU",
    color: "#E8547A",
    story:
      "Maya uses GenAI to brainstorm story angles and tidy up interview notes. A made-up quote once slipped into a draft, and now every name, number and claim gets traced back to a real source before it goes anywhere.",
  },
  {
    id: "malik",
    name: "Malik",
    studies: "Senior Nursing Student at ASU",
    color: "#4AB7C4",
    story:
      "Malik is careful with anything that touches health. Before trusting a GenAI answer about a medication or a symptom, Malik checks it against clinical sources, and asks who the tool was built for and who might be missing from its data.",
  },
  {
    id: "sam",
    name: "Sam",
    studies: "Sophomore Studio Art Student at ASU",
    color: "#FFC627",
    story:
      "Sam loves using GenAI to spark ideas for new pieces, but keeps asking whose artwork taught it to draw. It's there for inspiration, never for the finished work, so every piece still has a human hand in it.",
  },
];

// Until a learner picks a student, they get the one that used to be drawn for their character.
const DEFAULT_STUDENT_FOR_CHARACTER: Record<CharacterId, StudentId> = {
  aisha: "maya",
  dev: "malik",
  jordan: "sam",
};

export function getStudentInfo(id: StudentId | undefined): StudentInfo {
  return STUDENTS.find((s) => s.id === id) || STUDENTS[0];
}

/** The student to show: the one the learner picked, else the default for their character. */
export function resolveStudentId(
  student: StudentId | undefined,
  character: CharacterId | undefined
): StudentId | undefined {
  if (student) return student;
  return character ? DEFAULT_STUDENT_FOR_CHARACTER[character] : undefined;
}
