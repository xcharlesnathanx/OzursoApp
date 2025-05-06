-- Enable Row Level Security (RLS) for better security
ALTER DATABASE postgres SET anon.jwt_secret = 'your-supabase-jwt-secret';

-- Create Players Table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  photo_url TEXT,
  skills JSONB NOT NULL,
  average_score NUMERIC(4,2) NOT NULL
);

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);
CREATE INDEX IF NOT EXISTS idx_players_average_score ON players(average_score);

-- Sample Data (Optional - you can insert your own data)
INSERT INTO players (name, photo_url, skills, average_score)
VALUES 
  ('João Silva', 'https://randomuser.me/api/portraits/men/1.jpg', 
   '{"saque": 8, "recepcao": 7, "passe": 9, "ataque": 8, "bloqueio": 6, "defesa": 7, "mobilidade": 8}', 
   7.57),
  
  ('Ana Costa', 'https://randomuser.me/api/portraits/women/2.jpg', 
   '{"saque": 6, "recepcao": 9, "passe": 8, "ataque": 7, "bloqueio": 5, "defesa": 9, "mobilidade": 8}', 
   7.43),
  
  ('Carlos Ferreira', 'https://randomuser.me/api/portraits/men/3.jpg', 
   '{"saque": 9, "recepcao": 6, "passe": 7, "ataque": 9, "bloqueio": 8, "defesa": 6, "mobilidade": 7}', 
   7.43),
  
  ('Mariana Santos', 'https://randomuser.me/api/portraits/women/4.jpg', 
   '{"saque": 7, "recepcao": 8, "passe": 9, "ataque": 6, "bloqueio": 5, "defesa": 8, "mobilidade": 9}', 
   7.43),
  
  ('Rafael Oliveira', 'https://randomuser.me/api/portraits/men/5.jpg', 
   '{"saque": 8, "recepcao": 7, "passe": 6, "ataque": 8, "bloqueio": 9, "defesa": 7, "mobilidade": 6}', 
   7.29),
  
  ('Patricia Lima', 'https://randomuser.me/api/portraits/women/6.jpg', 
   '{"saque": 7, "recepcao": 8, "passe": 8, "ataque": 7, "bloqueio": 6, "defesa": 8, "mobilidade": 7}', 
   7.29)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous users (read-only)
CREATE POLICY "Allow anonymous read access" 
  ON players 
  FOR SELECT 
  TO anon
  USING (true);

-- Policy for authenticated users (full access)
CREATE POLICY "Allow authenticated full access" 
  ON players 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a view for team generation (optional)
CREATE OR REPLACE VIEW active_players AS
SELECT id, name, photo_url, skills, average_score
FROM players
ORDER BY average_score DESC;

-- Create function to calculate average score (optional helper)
CREATE OR REPLACE FUNCTION calculate_average_score(player_skills JSONB)
RETURNS NUMERIC AS $$
DECLARE
  avg_score NUMERIC;
BEGIN
  avg_score := (
    (player_skills->>'saque')::NUMERIC +
    (player_skills->>'recepcao')::NUMERIC +
    (player_skills->>'passe')::NUMERIC +
    (player_skills->>'ataque')::NUMERIC +
    (player_skills->>'bloqueio')::NUMERIC +
    (player_skills->>'defesa')::NUMERIC +
    (player_skills->>'mobilidade')::NUMERIC
  ) / 7.0;
  
  RETURN ROUND(avg_score, 2);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update average_score when skills change
CREATE OR REPLACE FUNCTION update_player_average_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.average_score := calculate_average_score(NEW.skills);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_player_average_score ON players;
CREATE TRIGGER trigger_update_player_average_score
  BEFORE INSERT OR UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_player_average_score();