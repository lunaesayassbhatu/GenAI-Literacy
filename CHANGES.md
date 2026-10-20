# ASU GenAI Lab — Change Summary

Session date: 2026-10-19
Status: **all changes below are local and uncommitted** (the only thing pushed this session was the Aisha/Dev character art, commit `4ca1ab9`).

This document lists what changed, where, how to see it, and what to check before release. Everything was verified with a TypeScript check and a production build (`npx vite build`); visual behavior was checked in screenshots for the 3D dolphin only. The rest should be looked at in the browser.

---

## 1. Ask Wave chat now runs on CreateAI

| | |
|---|---|
| **What** | The chat assistant calls the ASU CreateAI OpenAI-compatible gateway instead of calling Anthropic directly. |
| **Endpoint** | `https://api-main.aiml.asu.edu/v1/chat/completions` |
| **Model** | `aws/claude4_5_haiku` (Claude 4.5 Haiku; marked *Experimental* on the CreateAI Models page — confirm it is still available before the demo) |
| **Auth** | A CreateAI **service token**, sent only from the server-side function. Never put it in front-end code or a `VITE_` variable. |
| **Env var** | `CREATEAI_API_KEY` (was `ANTHROPIC_API_KEY`) |

Files: `api/chatHandler.ts`, `api/chat.ts`, `vite.config.ts`, `.env.example`, `supabase/README.md`

**Before deploying:** add `CREATEAI_API_KEY` in the hosting provider's environment settings (for example Vercel → Settings → Environment Variables) and redeploy. A direct test call of the handler returned HTTP 200 with a correct answer.

## 2. Ask Wave: friendlier tone and richer formatting

- **Prompt (`api/chatHandler.ts`):** very friendly peer-mentor personality, a few emojis, key terms in bold, short bullet lists, under ~120 words, ends with a follow-up question or a nudge to a module/game. Off-topic questions are redirected playfully. `max_tokens` raised to 600.
- **Chat window (`src/app/components/AskWaveChat.tsx`):** replies now render **bold**, *italics* and bullet lists. The renderer builds React elements (no HTML injection), so unexpected model output cannot inject markup. Friendlier welcome message and "thinking" text.

## 3. Module lessons: zoom-in chat steps that do not scroll

File: `src/app/components/ModuleLearning.tsx` (`WaveTalkStep`)

- The newest message zooms in from slightly smaller and blurred; the previous messages shrink into a small blurred stack above it (last three kept).
- Click a shrunken message, click a progress dot, or press **Back** to go back. **Continue** moves forward.
- The step fits exactly one screen, so the page does not scroll. A very long message scrolls inside its own bubble only.
- The "learn more" star on a message is larger (46 px), glows and pulses so it is easy to notice.

## 4. Real-world examples and scenarios are highlighted

File: `src/app/components/ModuleLearning.tsx`

- **Real-world examples:** tinted, glowing bubble in the character's color, a **🌍 REAL-WORLD EXAMPLE** pill, the character's portrait, name and description (for example "Aisha · Sophomore Psychology Student at ASU"), and the name bolded in the character's color.
- **Scenarios:** quiz questions about a character show as a highlighted card with a **🎭 SCENARIO** pill plus the same character header.
- Stories that used "John" (not one of the three characters) now use Dev or Aisha. Files: `src/app/utils/steps/module1Steps.ts`, `module2Steps.ts`. One story that named two characters was reworded in `module4Steps.ts`.

## 5. Stories follow the learner's chosen character

New file: `src/app/utils/personalizeStory.ts`, used by `ModuleLearning.tsx`.

- Every story, scenario, question, answer and feedback line is rewritten at load time so only the **chosen** character (Aisha, Dev or Jordan) appears. If the learner picks another character on purpose, the stories switch the next time a module opens.
- Pronouns are adjusted (Aisha she/her; Dev and Jordan he/him). A check over all modules and all three choices found no leaked names.
- If no character has been chosen yet, it falls back to Aisha (the app's default).

## 6. "Your Progress" strip on every page + XP and level display

New file: `src/app/components/ProgressStrip.tsx`, added in `src/app/routes.tsx`.

- A slim strip at the top of every signed-in page shows overall progress (percent and modules completed), a **Continue: <module>** link, a level badge (for example `Lv 2 · Learner`), a level progress bar, "N to next level", and XP. The XP number pops each time XP is earned.
- Crossing into a new level shows a **🎉 Level Up!** banner with confetti.
- Hidden on the login, reset-password and **home** pages.
- The no-scroll Wave-talk step subtracts the strip's height so it still fits the screen.

## 7. Wave introduces himself (Guide Wave vs Ask Wave)

New files: `src/app/components/WaveIntro.tsx`, `src/app/components/WaveDolphin3D.tsx`. Registered in `src/app/routes.tsx`.

- A blurred, dimmed overlay with Wave in a gold frame and two role cards that explain where each role lives:
  - **🧭 Guide Wave** — bottom-right corner: tips, hints, reactions in modules and games.
  - **💬 Ask Wave** — bottom-left corner button: the chat for any GenAI question.
- Shown **on the Learning Lab page only** (not in modules or games). Enter, Esc or "Let's go!" closes it.
- **Temporary setting:** `SHOW_EVERY_TIME = true` at the top of `WaveIntro.tsx` shows it on every Learning Lab visit while the design is reviewed. Set it to `false` to show it only on a user's first visit (remembered per username in the browser).

### The 3D dolphin
- Built with **three.js** (new dependencies `three` and `@types/three`; the main bundle grew by roughly 500 KB). There was no model file, so the dolphin is generated in code.
- Matched to the flat mascot: slate-blue body, white belly rising to the chin, ASU maroon-and-gold stripes on the dorsal fin and tail, soft smile, small natural eyes, glossy finish. He swims laps in 3D (tail beats, banks into turns, bobs) over an underwater backdrop with bubbles.
- Falls back to the flat mascot image if the browser cannot run WebGL.
- A designer-supplied `.glb` model would match the mascot exactly and could replace the generated one.

## 8. Home page: "Why Learn with ASU GenAI Lab?" cards are clickable

File: `src/app/components/HomePage.tsx`

| Card | Goes to |
|---|---|
| Practical Skills | Learning Lab |
| Interactive Learning | Games |
| Built for ASU | Your path map (`/map`) |
| Track Progress | Profile |

Each card lifts on hover, has a pointer cursor, and ends with a colored link line and arrow.

---

## How to see the changes

```
cd "C:\Users\sbhat\Downloads\GenAILiteracy-main (1)\GenAILiteracy-main"
npm run dev        # then open http://localhost:5173
```

Sign in with a chosen character. The login-gated pages need real Supabase credentials in `.env.local` (they were placeholders earlier).

## Before release — checklist

- [ ] Set `SHOW_EVERY_TIME` to `false` in `WaveIntro.tsx` if the intro should only appear for new users.
- [ ] Add `CREATEAI_API_KEY` to the hosting environment variables and redeploy.
- [ ] Confirm the CreateAI model `aws/claude4_5_haiku` is still active (it was labelled Experimental).
- [ ] Check the screens above in a browser, including a small window for the no-scroll chat steps.
- [ ] Confirm the character assignments for the former "John" stories (Dev and Aisha) with the content owner.
- [ ] Decide whether the extra ~500 KB from `three` is acceptable, or lazy-load the 3D scene.
- [ ] Commit and push (nothing from this list is committed yet).

## Not changed

The quiz, scenario and drag-and-drop steps still scroll as before. Games, the Profile page's mock leaderboard/friends list, and the separate "+N XP" popups in modules and games were not touched.
