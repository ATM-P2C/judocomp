-- Insert default combat rules
INSERT INTO combat_rules (name, duration, ippon_points, wazaari_points, yuko_points, max_penalties, golden_score, golden_score_duration)
VALUES 
  ('Standard Rules', 240, 10, 7, 1, 3, true, 180),
  ('Youth Rules', 180, 10, 7, 1, 3, true, 120),
  ('Children Rules', 120, 10, 7, 1, 3, false, null);

-- Insert sample clubs
INSERT INTO clubs (id, name, address, contact_name, contact_email, contact_phone, logo_url)
VALUES 
  (gen_random_uuid(), 'Judo Club Paris', '15 Rue du Judo, 75001 Paris', 'Jean Dupont', 'contact@judoclubparis.fr', '01 23 45 67 89', 'https://images.unsplash.com/photo-1583290173631-9ad7d6c051f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'),
  (gen_random_uuid(), 'Judo Club Lyon', '25 Avenue des Sports, 69001 Lyon', 'Marie Martin', 'contact@judoclublyon.fr', '04 56 78 90 12', 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'),
  (gen_random_uuid(), 'Judo Club Marseille', '8 Boulevard du Tatami, 13001 Marseille', 'Pierre Dubois', 'contact@judoclubmarseille.fr', '04 91 23 45 67', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'),
  (gen_random_uuid(), 'Judo Club Bordeaux', '12 Rue des Arts Martiaux, 33000 Bordeaux', 'Sophie Leroy', 'contact@judoclubbordeaux.fr', '05 56 78 90 12', 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'),
  (gen_random_uuid(), 'Judo Club Toulouse', '5 Place du Dojo, 31000 Toulouse', 'Thomas Moreau', 'contact@judoclubtoulouse.fr', '05 61 23 45 67', null),
  (gen_random_uuid(), 'Judo Club Lille', '18 Rue des Champions, 59000 Lille', 'Philippe Durand', 'contact@judoclublille.fr', '03 20 12 34 56', null),
  (gen_random_uuid(), 'Judo Club Nice', '7 Avenue du Tatami, 06000 Nice', 'Claire Rousseau', 'contact@judoclubnice.fr', '04 93 12 34 56', null),
  (gen_random_uuid(), 'Judo Club Strasbourg', '22 Rue du Judo, 67000 Strasbourg', 'Marc Weber', 'contact@judoclubstrasbourg.fr', '03 88 12 34 56', null);

-- Insert sample tournament
INSERT INTO tournaments (name, date, location, organizer, contact_email, status, combat_rules_id)
VALUES 
  ('Championnat Régional de Judo 2025', '2025-06-15', 'Palais des Sports, Paris', 'Fédération Française de Judo', 'contact@ffjudo.com', 'published', 
   (SELECT id FROM combat_rules WHERE name = 'Standard Rules'));

-- Insert tournament settings
INSERT INTO tournament_settings (tournament_id, seeding_method, pool_size, elimination_type, third_place_match, points_for_win, points_for_draw, points_for_loss)
VALUES 
  ((SELECT id FROM tournaments WHERE name = 'Championnat Régional de Judo 2025'), 'belt', 4, 'double', true, 10, 5, 0);

-- Insert sample categories
INSERT INTO categories (name, age_category, weight_category, gender, tournament_id)
VALUES 
  ('Minimes -46kg', 'Minimes', '-46kg', 'male', (SELECT id FROM tournaments WHERE name = 'Championnat Régional de Judo 2025')),
  ('Cadets -60kg', 'Cadets', '-60kg', 'male', (SELECT id FROM tournaments WHERE name = 'Championnat Régional de Judo 2025')),
  ('Juniors -73kg', 'Juniors', '-73kg', 'male', (SELECT id FROM tournaments WHERE name = 'Championnat Régional de Judo 2025')),
  ('Seniors -66kg', 'Seniors', '-66kg', 'male', (SELECT id FROM tournaments WHERE name = 'Championnat Régional de Judo 2025')),
  ('Benjamins -38kg', 'Benjamins', '-38kg', 'male', (SELECT id FROM tournaments WHERE name = 'Championnat Régional de Judo 2025'));

-- Insert sample competitors
INSERT INTO competitors (first_name, last_name, club_id, age_category, weight_category, age, belt, license_number, emergency_contact, gender)
VALUES 
  ('Lucas', 'Martin', (SELECT id FROM clubs WHERE name = 'Judo Club Paris'), 'Minimes', '-46kg', 13, 'Orange', 'FJ123456', '0612345678', 'male'),
  ('Emma', 'Bernard', (SELECT id FROM clubs WHERE name = 'Judo Club Lyon'), 'Benjamins', '-40kg', 11, 'Jaune/Orange', 'FJ234567', '0623456789', 'female'),
  ('Thomas', 'Dubois', (SELECT id FROM clubs WHERE name = 'Judo Club Marseille'), 'Minimes', '-46kg', 13, 'Verte', 'FJ345678', '0634567890', 'male'),
  ('Léa', 'Petit', (SELECT id FROM clubs WHERE name = 'Judo Club Bordeaux'), 'Benjamins', '-44kg', 12, 'Orange', 'FJ456789', '0645678901', 'female'),
  ('Maxime', 'Dupont', (SELECT id FROM clubs WHERE name = 'Judo Club Lille'), 'Juniors', '-73kg', 17, 'Marron', 'FJ567890', '0656789012', 'male'),
  ('Chloé', 'Leroy', (SELECT id FROM clubs WHERE name = 'Judo Club Toulouse'), 'Cadets', '-57kg', 15, 'Bleue', 'FJ678901', '0667890123', 'female'),
  ('Antoine', 'Moreau', (SELECT id FROM clubs WHERE name = 'Judo Club Nice'), 'Juniors', '-73kg', 16, 'Marron', 'FJ789012', '0678901234', 'male'),
  ('Camille', 'Fournier', (SELECT id FROM clubs WHERE name = 'Judo Club Strasbourg'), 'Cadets', '-63kg', 15, 'Bleue', 'FJ890123', '0689012345', 'female');

-- Insert sample tatamis
INSERT INTO tatamis (name, status)
VALUES 
  ('Tatami 1', 'active'),
  ('Tatami 2', 'active'),
  ('Tatami 3', 'inactive'),
  ('Tatami 4', 'paused');

-- Insert sample volunteers
INSERT INTO volunteers (first_name, last_name, club_id, role, time_slots, points, status)
VALUES 
  ('Jean', 'Dupont', (SELECT id FROM clubs WHERE name = 'Judo Club Paris'), 'Arbitre', ARRAY['Samedi Matin', 'Samedi Après-midi'], 15, 'confirmed'),
  ('Marie', 'Martin', (SELECT id FROM clubs WHERE name = 'Judo Club Lyon'), 'Agent de pesée', ARRAY['Dimanche Matin'], 5, 'confirmed'),
  ('Pierre', 'Dubois', (SELECT id FROM clubs WHERE name = 'Judo Club Marseille'), 'Commissaire sportif', ARRAY['Samedi Matin', 'Samedi Après-midi', 'Dimanche Matin'], 20, 'confirmed'),
  ('Sophie', 'Leroy', (SELECT id FROM clubs WHERE name = 'Judo Club Bordeaux'), 'Accueil', ARRAY['Samedi Matin'], 5, 'pending');

-- Insert sample pools
DO $$
DECLARE
  minimes_category_id UUID;
  benjamins_category_id UUID;
  tournament_id UUID;
BEGIN
  SELECT id INTO minimes_category_id FROM categories WHERE name = 'Minimes -46kg';
  SELECT id INTO benjamins_category_id FROM categories WHERE name = 'Benjamins -38kg';
  SELECT id INTO tournament_id FROM tournaments WHERE name = 'Championnat Régional de Judo 2025';
  
  INSERT INTO pools (name, category_id, tournament_id)
  VALUES 
    ('Poule A', minimes_category_id, tournament_id),
    ('Poule B', minimes_category_id, tournament_id),
    ('Poule A', benjamins_category_id, tournament_id);
END $$;

-- Insert sample pool competitors
DO $$
DECLARE
  pool_a_id UUID;
  lucas_id UUID;
  thomas_id UUID;
BEGIN
  SELECT p.id INTO pool_a_id 
  FROM pools p 
  JOIN categories c ON p.category_id = c.id 
  WHERE p.name = 'Poule A' AND c.name = 'Minimes -46kg';
  
  SELECT id INTO lucas_id FROM competitors WHERE first_name = 'Lucas' AND last_name = 'Martin';
  SELECT id INTO thomas_id FROM competitors WHERE first_name = 'Thomas' AND last_name = 'Dubois';
  
  IF pool_a_id IS NOT NULL AND lucas_id IS NOT NULL AND thomas_id IS NOT NULL THEN
    INSERT INTO pool_competitors (pool_id, competitor_id, wins, points)
    VALUES 
      (pool_a_id, lucas_id, 3, 30),
      (pool_a_id, thomas_id, 2, 20);
  END IF;
END $$;