-- Create content table for website content management
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  title_en TEXT NOT NULL,
  title_bn TEXT,
  content_en TEXT NOT NULL,
  content_bn TEXT,
  image_url TEXT,
  link TEXT,
  order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on section and key for faster queries
CREATE INDEX IF NOT EXISTS idx_content_section ON content(section);
CREATE INDEX IF NOT EXISTS idx_content_key ON content(key);

-- Create unique constraint on section and key
ALTER TABLE content ADD CONSTRAINT unique_section_key UNIQUE (section, key);

-- Insert some initial content
INSERT INTO content (section, key, title_en, content_en, is_active, order)
VALUES 
  ('hero', 'main-heading', 'Samridha Uttar - Prosperous North', 'Supporting communities through education, service, and dawah initiatives', true, 1),
  ('hero', 'sub-heading', 'Join Our Mission', 'Help us build a better future for communities in need', true, 2),
  ('about', 'main-heading', 'About Us', 'Samridha Uttar is dedicated to serving humanity through various charitable programs and initiatives.', true, 1),
  ('mission', 'mission-statement', 'Our Mission', 'Our mission is to serve humanity by providing essential services to those in need, regardless of their background, religion, or ethnicity.', true, 1),
  ('mission', 'vision-statement', 'Our Vision', 'We envision a world where poverty, hunger, and inequality are eliminated, and every person has the opportunity to live a dignified life.', true, 2),
  ('programs', 'education', 'Education Program', 'Providing quality education to underprivileged children in rural areas.', true, 1),
  ('programs', 'healthcare', 'Healthcare Initiative', 'Bringing medical services to those who need it most in remote communities.', true, 2),
  ('programs', 'dawah', 'Dawah Activities', 'Spreading knowledge and understanding through community engagement and educational programs.', true, 3),
  ('impact', 'stats-heading', 'Our Impact', 'Making a difference in communities across the region', true, 1),
  ('footer', 'about', 'About Samridha Uttar', 'Samridha Uttar is dedicated to serving humanity through various charitable programs and initiatives focused on education, service, and dawah.', true, 1)
ON CONFLICT (section, key) DO NOTHING;
