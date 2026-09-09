# Supabase setup

The app's client code (`src/app/utils/userData.ts`, `migrateToSupabase.ts`,
`moduleProgress.ts`, `authContext.tsx`, `Login.tsx`) already expects a real
Supabase project — it just hasn't had one to talk to yet. Follow these steps
once to create it.

1. **Create a project** at [supabase.com](https://supabase.com) (free tier is fine).

2. **Run the schema**: open the project's *SQL Editor* → *New query*, paste in
   the full contents of [`schema.sql`](./schema.sql), and run it. This creates
   the 5 tables the app uses (`profiles`, `user_stats`, `badges`,
   `module_progress`, `module_xp`) with row-level security enabled, so each
   signed-in user can only read/write their own rows.

3. **Copy your credentials**: in the project, go to *Settings → API* and copy:
   - *Project URL*
   - *anon public* key

4. **Update `.env.local`** in the project root (create it from `.env.example`
   if you haven't already) with the real values:

   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
   ```

5. **Restart the dev server** (`npm run dev`). Sign-up / sign-in through the
   actual login form should now create real rows — check the *Table Editor*
   in Supabase to confirm a `profiles` and `user_stats` row appears after you
   sign up.

No application code needs to change for this — the sync/hydrate functions
already call these exact tables and columns.

## Ask Wave chatbot (separate, optional)

`api/chat.ts` calls the Anthropic API and needs an `ANTHROPIC_API_KEY`. It's a
Vercel serverless function, so it won't run under plain `npm run dev` — it
only works when deployed to Vercel (or run via the Vercel CLI's `vercel dev`).
Set `ANTHROPIC_API_KEY` in the Vercel project's environment variables
(Production + Preview + Development) when you're ready to use it; it's
unrelated to the Supabase setup above.
