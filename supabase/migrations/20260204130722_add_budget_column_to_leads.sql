/*
  # Add Budget Column to Leads Table

  1. Changes
    - Adds `budget` column to `leads` table
    - Type: numeric to store monetary values
    - Nullable since not all leads may have a budget specified

  2. Notes
    - Budget is filled in by clients on the lead form
    - Read-only field for CRM users
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'budget'
  ) THEN
    ALTER TABLE leads ADD COLUMN budget numeric;
  END IF;
END $$;