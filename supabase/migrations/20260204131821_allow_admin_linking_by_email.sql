/*
  # Allow Admin Account Linking by Email
  
  Voegt policies toe zodat gebruikers hun account kunnen koppelen
  aan een admin record op basis van email adres.
  
  1. Security Changes
    - SELECT policy: gebruiker kan admin record zien met matchende email
    - UPDATE policy: gebruiker kan user_id updaten als email matcht
*/

CREATE POLICY "Users can view admin record by email"
  ON admins FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can link their account to admin record"
  ON admins FOR UPDATE
  TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) AND user_id IS NULL)
  WITH CHECK (user_id = auth.uid());