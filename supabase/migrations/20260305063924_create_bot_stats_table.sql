/*
  # Create Bot Statistics Table

  1. New Tables
    - `bot_stats`
      - `id` (uuid, primary key)
      - `servers` (bigint) - Total number of servers using the bot
      - `users` (bigint) - Total number of users
      - `commands_executed` (bigint) - Total commands executed
      - `uptime_percentage` (numeric) - Bot uptime percentage
      - `updated_at` (timestamptz) - Last update timestamp
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `bot_stats` table
    - Add policy for public read access (stats are public)
    - No write access for regular users (stats updated by backend only)

  3. Initial Data
    - Insert initial statistics record
*/

CREATE TABLE IF NOT EXISTS bot_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  servers bigint DEFAULT 0,
  users bigint DEFAULT 0,
  commands_executed bigint DEFAULT 0,
  uptime_percentage numeric(5,2) DEFAULT 99.9,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bot_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bot stats"
  ON bot_stats
  FOR SELECT
  TO anon, authenticated
  USING (true);

INSERT INTO bot_stats (servers, users, commands_executed, uptime_percentage)
VALUES (52847, 12456789, 45678912, 99.9)
ON CONFLICT DO NOTHING;
