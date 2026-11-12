// Step types (mirrors the StepType union in ModuleLearning.tsx)
export type StepType =
  | "intro"
  | "reading"
  | "transition"
  | "scenario"
  | "knowledge-check"
  | "ranking-check"
  | "pros-cons"
  | "web-map"
  | "process"
  | "framework-table"
  | "video"
  | "drag-drop"
  | "wave-talk"
  | "completion";

export interface Step {
  type: StepType;
  data: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-module step files
// ─────────────────────────────────────────────────────────────────────────────
import { module1Steps } from "./steps/module1Steps";

import { module2Steps } from "./steps/module2Steps";

import { module3Steps } from "./steps/module3Steps";

import { module4Steps } from "./steps/module4Steps";

import {
  module5Steps,
  module5Section1Variants,
  module5Section2Variants,
  module5Section3Variants,
} from "./steps/module5Steps";

import {
  module6Steps,
  module6Section1Variants,
  module6Section2Variants,
  module6Section3Variants,
} from "./steps/module6Steps";

import {
  module7Steps,
  module7Section1Variants,
  module7Section2Variants,
  module7Section3Variants,
} from "./steps/module7Steps";

// Re-export variant counts for any consumer that needs them
export { MODULE1_SECTION1_VARIANT_COUNT } from "./steps/module1Steps";
export { MODULE2_SECTION_VARIANT_COUNT } from "./steps/module2Steps";
export { MODULE3_SECTION_VARIANT_COUNT } from "./steps/module3Steps";
export { MODULE4_SECTION_VARIANT_COUNT } from "./steps/module4Steps";
export { MODULE5_SECTION_VARIANT_COUNT } from "./steps/module5Steps";
export { MODULE6_SECTION_VARIANT_COUNT } from "./steps/module6Steps";
export { MODULE7_SECTION_VARIANT_COUNT } from "./steps/module7Steps";

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY — add each module's steps here as they are written
// ─────────────────────────────────────────────────────────────────────────────
const MODULE_STEPS: Record<string, Step[]> = {
  "module-1": module1Steps,
  "module-2": module2Steps,
  "module-3": module3Steps,
  "module-4": module4Steps,
  "module-5": module5Steps,
  "module-6": module6Steps,
  "module-7": module7Steps,
};

export function getStepsForModule(moduleId: string, questionVariant: number = 0): Step[] {
  const base = MODULE_STEPS[moduleId];
  if (!base) return [];

  // Modules 1 to 4 now carry fixed content written to match the team's module document (no
  // rotating variants — the same questions are shown every time).

  if (moduleId === "module-5") {
    const idx = questionVariant % module5Section1Variants.length;
    return base.map(step => {
      const section = (step.data as any)?.section;
      if (step.type === "knowledge-check" && section === "1") return module5Section1Variants[idx];
      if (step.type === "knowledge-check" && section === "2") return module5Section2Variants[idx];
      if (step.type === "knowledge-check" && section === "3") return module5Section3Variants[idx];
      return step;
    });
  }

  if (moduleId === "module-6") {
    const idx = questionVariant % module6Section1Variants.length;
    return base.map(step => {
      const section = (step.data as any)?.section;
      if (step.type === "knowledge-check" && section === "1") return module6Section1Variants[idx];
      if (step.type === "knowledge-check" && section === "2") return module6Section2Variants[idx];
      if (step.type === "knowledge-check" && section === "3") return module6Section3Variants[idx];
      return step;
    });
  }

  if (moduleId === "module-7") {
    const idx = questionVariant % module7Section1Variants.length;
    return base.map(step => {
      const section = (step.data as any)?.section;
      if (step.type === "knowledge-check" && section === "1") return module7Section1Variants[idx];
      if (step.type === "knowledge-check" && section === "2") return module7Section2Variants[idx];
      if (step.type === "knowledge-check" && section === "3") return module7Section3Variants[idx];
      return step;
    });
  }

  return base;
}
