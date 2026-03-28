-- ═══════════════════════════════════════════════════════════════
--  Brain Visualizer – MySQL Schema + Seed Data
--  Run: mysql -u root -p < backend/database/schema.sql
-- ═══════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS brain_visualizer
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE brain_visualizer;

-- ── Table: emotions ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS emotions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(50)  NOT NULL UNIQUE,
  description TEXT,
  color       VARCHAR(20)  NOT NULL DEFAULT '#6366f1',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ── Table: brain_regions ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brain_regions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  function_desc TEXT,
  x_pos         FLOAT        NOT NULL DEFAULT 0,
  y_pos         FLOAT        NOT NULL DEFAULT 0,
  z_pos         FLOAT        NOT NULL DEFAULT 0,
  size          FLOAT        NOT NULL DEFAULT 0.32
);

-- ── Table: mappings ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mappings (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  emotion_id INT   NOT NULL,
  region_id  INT   NOT NULL,
  intensity  FLOAT NOT NULL CHECK (intensity BETWEEN 0 AND 1),
  FOREIGN KEY (emotion_id) REFERENCES emotions(id) ON DELETE CASCADE,
  FOREIGN KEY (region_id)  REFERENCES brain_regions(id) ON DELETE CASCADE,
  UNIQUE KEY uq_mapping (emotion_id, region_id)
);

-- ── Table: history ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS history (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  emotion             VARCHAR(50) NOT NULL,
  intensity_multiplier FLOAT      NOT NULL DEFAULT 1.0,
  timestamp           DATETIME    DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_emotion   (emotion),
  INDEX idx_timestamp (timestamp)
);

-- ═══════════════════════════════════════════════════════════════
--  SEED DATA
-- ═══════════════════════════════════════════════════════════════

-- Emotions
INSERT IGNORE INTO emotions (name, description, color) VALUES
  ('pain',      'Unpleasant sensory and emotional experience associated with tissue damage.', '#ef4444'),
  ('happiness', 'Positive emotional state linked to reward, pleasure, and well-being.',      '#eab308'),
  ('fear',      'Response to perceived threat; triggers fight-or-flight mechanisms.',        '#8b5cf6'),
  ('anger',     'Emotional response to perceived injustice or provocation.',                 '#f97316'),
  ('sadness',   'Emotional pain associated with loss, helplessness, or disappointment.',     '#3b82f6');

-- Brain Regions (name, function, x, y, z, size)
INSERT IGNORE INTO brain_regions (name, function_desc, x_pos, y_pos, z_pos, size) VALUES
  ('Prefrontal Cortex',         'Decision-making, planning, personality, and positive emotion regulation.',    0.0,  0.45, 1.5,  0.45),
  ('Anterior Cingulate Cortex', 'Error detection, conflict monitoring, and the emotional coloring of pain.',   0.0,  0.75, 0.9,  0.32),
  ('Thalamus',                  'Sensory relay hub; routes pain and other signals to appropriate cortex.',      0.0, -0.15, 0.1,  0.38),
  ('Hypothalamus',              'Regulates stress hormones, autonomic responses, and homeostasis.',            0.0, -0.58, 0.38, 0.25),
  ('Dopamine Pathway',          'Mesolimbic reward circuit; drives pleasure, motivation, and reinforcement.',   0.0,  0.1,  0.65, 0.36),
  ('Amygdala',                  'Threat detection, fear conditioning, and emotional memory consolidation.',     0.0, -0.45, 0.55, 0.30),
  ('Insula',                    'Interoception, pain processing, and awareness of bodily states.',              0.0,  0.1,  0.35, 0.30),
  ('Hippocampus',               'Episodic memory formation, spatial navigation, and mood regulation.',          0.0, -0.55,-0.22, 0.32);

-- Mappings  (emotion → region, intensity 0–1)
INSERT IGNORE INTO mappings (emotion_id, region_id, intensity)
SELECT e.id, r.id, v.intensity
FROM (VALUES
  ROW('pain',      'Insula',                    0.90),
  ROW('pain',      'Thalamus',                  0.80),
  ROW('pain',      'Anterior Cingulate Cortex', 0.85),
  ROW('happiness', 'Prefrontal Cortex',         0.90),
  ROW('happiness', 'Dopamine Pathway',          0.85),
  ROW('fear',      'Amygdala',                  0.95),
  ROW('fear',      'Hypothalamus',              0.70),
  ROW('anger',     'Amygdala',                  0.90),
  ROW('anger',     'Prefrontal Cortex',         0.75),
  ROW('sadness',   'Hippocampus',               0.85)
) AS v(emotion_name, region_name, intensity)
JOIN emotions e ON e.name = v.emotion_name
JOIN brain_regions r ON r.name = v.region_name;

-- Sample history rows for analytics demo
INSERT INTO history (emotion, intensity_multiplier, timestamp) VALUES
  ('pain',      0.9,  NOW() - INTERVAL 10 DAY),
  ('fear',      1.0,  NOW() - INTERVAL 9  DAY),
  ('happiness', 0.8,  NOW() - INTERVAL 8  DAY),
  ('sadness',   0.95, NOW() - INTERVAL 7  DAY),
  ('anger',     1.0,  NOW() - INTERVAL 6  DAY),
  ('happiness', 1.0,  NOW() - INTERVAL 5  DAY),
  ('fear',      0.85, NOW() - INTERVAL 4  DAY),
  ('pain',      1.0,  NOW() - INTERVAL 3  DAY),
  ('happiness', 0.9,  NOW() - INTERVAL 2  DAY),
  ('sadness',   0.7,  NOW() - INTERVAL 1  DAY);

