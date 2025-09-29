-- Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  date_of_birth DATE,
  city TEXT,
  state TEXT,
  emergency_contact TEXT,
  emergency_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de contatos de emergência
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de gravações de áudio
CREATE TABLE IF NOT EXISTS audio_recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  duration INTEGER NOT NULL, -- em segundos
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de planos de fuga
CREATE TABLE IF NOT EXISTS escape_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  situation TEXT,
  safe_location TEXT,
  trusted_contacts TEXT,
  important_documents TEXT[], -- array de documentos
  financial_resources TEXT,
  exit_plan TEXT,
  safety_measures TEXT[], -- array de medidas
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de logs de alertas
CREATE TABLE IF NOT EXISTS alert_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL, -- 'panic', 'emergency_contact', 'audio_recording'
  message TEXT,
  contacts_notified INTEGER DEFAULT 0,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE escape_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança - usuários só podem ver seus próprios dados
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own emergency contacts" ON emergency_contacts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own emergency contacts" ON emergency_contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own audio recordings" ON audio_recordings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own audio recordings" ON audio_recordings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own escape plans" ON escape_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own escape plans" ON escape_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own alert logs" ON alert_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alert logs" ON alert_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at nas tabelas relevantes
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_escape_plans_updated_at BEFORE UPDATE ON escape_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
