/*
# Add career and semester to profiles

1. Modified Tables
   - `profiles`
     - Add `career` (text) — university career/program of the student (e.g. Ingeniería de Sistemas).
     - Add `semester` (text) — current academic semester (e.g. "1", "2", ... "10+").
   Both columns are nullable so existing rows are not affected. New registrations will fill them.

2. Security
   - No RLS policy changes. Existing profile policies already allow users to read all profiles and update/insert their own.

3. Important notes
   - The columns are added with `IF NOT EXISTS` via a DO block so the migration is idempotent.
   - No data is lost; existing profiles simply have NULL career/semester until they edit their profile.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'career') THEN
    ALTER TABLE profiles ADD COLUMN career text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'semester') THEN
    ALTER TABLE profiles ADD COLUMN semester text;
  END IF;
END $$;
