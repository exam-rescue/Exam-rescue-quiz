-- Seed Data for Exam Rescue
-- Run after 0001_schema.sql
-- Run: wrangler d1 migrations apply exam-rescue-db --remote

-- ============================================================
-- SEED PLAYERS (5 fake leaderboard players)
-- ============================================================
INSERT OR IGNORE INTO Player (id, name, totalXp, level, currentStreak, bestStreak, totalQuestions, correctAnswers, bestCombo, gamesPlayed, fastestCorrect, createdAt, updatedAt)
VALUES
  ('seed-player-1', 'QuizMaster3000', 12500, 15, 5, 12, 480, 385, 8, 52, 1.2, '2025-01-15T08:00:00Z', '2025-06-10T14:30:00Z'),
  ('seed-player-2', 'ScienceNerd42', 8750, 10, 3, 7, 310, 248, 6, 34, 2.1, '2025-02-20T10:15:00Z', '2025-06-09T18:45:00Z'),
  ('seed-player-3', 'BioBoss99', 6200, 7, 8, 8, 225, 169, 5, 26, 1.8, '2025-03-05T12:00:00Z', '2025-06-10T09:20:00Z'),
  ('seed-player-4', 'MathWizKid', 3400, 5, 1, 4, 145, 98, 4, 18, 3.5, '2025-04-10T16:30:00Z', '2025-06-08T20:10:00Z'),
  ('seed-player-5', 'CasualLearner', 1200, 2, 0, 2, 65, 38, 3, 9, 5.0, '2025-05-01T09:00:00Z', '2025-06-07T11:00:00Z');

-- ============================================================
-- SEED SCORES (a few recent scores for leaderboard context)
-- ============================================================
INSERT OR IGNORE INTO Score (id, playerId, category, difficulty, xpEarned, correctCount, totalCount, comboMax, timeTaken, mode, createdAt)
VALUES
  ('seed-score-1', 'seed-player-1', 'Physics', 'hard', 350, 9, 10, 7, 45.2, 'battle', '2025-06-10T14:30:00Z'),
  ('seed-score-2', 'seed-player-1', 'Chemistry', 'medium', 280, 8, 10, 5, 38.1, 'battle', '2025-06-09T15:20:00Z'),
  ('seed-score-3', 'seed-player-2', 'Biology', 'easy', 220, 7, 10, 4, 52.0, 'battle', '2025-06-09T18:45:00Z'),
  ('seed-score-4', 'seed-player-2', 'Maths', 'medium', 260, 8, 10, 6, 41.3, 'battle', '2025-06-08T20:00:00Z'),
  ('seed-score-5', 'seed-player-3', 'Physics', 'medium', 240, 7, 10, 5, 44.8, 'battle', '2025-06-10T09:20:00Z'),
  ('seed-score-6', 'seed-player-4', 'Chemistry', 'easy', 150, 5, 10, 3, 60.5, 'battle', '2025-06-08T20:10:00Z'),
  ('seed-score-7', 'seed-player-5', 'Mixed', 'easy', 120, 4, 10, 3, 55.0, 'battle', '2025-06-07T11:00:00Z');

-- ============================================================
-- SEED QUESTIONS (all 40 questions from question bank)
-- ============================================================

-- PHYSICS (10 questions)
INSERT OR IGNORE INTO Question (id, text, optionA, optionB, optionC, optionD, correct, explanation, subject, difficulty)
VALUES
  ('phy1', 'A body of mass 2 kg is thrown vertically upward with a velocity of 20 m/s. What is the kinetic energy at the highest point?', '400 J', '200 J', '0 J', '100 J', 3, 'At the highest point, velocity becomes zero, so kinetic energy = ½mv² = 0.', 'Physics', 'easy'),
  ('phy2', 'The SI unit of electric charge is:', 'Ampere', 'Coulomb', 'Volt', 'Ohm', 2, 'The SI unit of electric charge is the Coulomb (C). One coulomb is the charge transported by a current of 1 ampere in 1 second.', 'Physics', 'easy'),
  ('phy3', 'A convex lens of focal length 20 cm produces a real, inverted image of magnification 2. The object distance is:', '60 cm', '40 cm', '30 cm', '20 cm', 3, 'Using lens formula: 1/v - 1/u = 1/f. Given m = -v/u = 2, so v = -2u. Substituting: 1/(-2u) - 1/u = 1/20, solving gives u = -30 cm.', 'Physics', 'medium'),
  ('phy4', 'Two resistors of 6Ω and 3Ω are connected in parallel. The equivalent resistance is:', '9Ω', '2Ω', '3Ω', '1Ω', 2, 'For parallel resistors: 1/R = 1/R₁ + 1/R₂ = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2. So R = 2Ω.', 'Physics', 'easy'),
  ('phy5', 'The work done by a force is maximum when the angle between force and displacement is:', '0°', '45°', '90°', '180°', 1, 'Work = F × d × cosθ. Work is maximum when cosθ = 1, i.e., when θ = 0° (force and displacement are parallel).', 'Physics', 'easy'),
  ('phy6', 'A capacitor of capacitance 10μF is charged to 100V. The energy stored is:', '0.05 J', '0.5 J', '50 J', '1000 J', 1, 'Energy stored in a capacitor = ½CV² = ½ × 10 × 10⁻⁶ × (100)² = ½ × 10⁻⁵ × 10⁴ = 0.05 J.', 'Physics', 'medium'),
  ('phy7', 'The de Broglie wavelength of an electron accelerated through 100V is approximately:', '1.23 nm', '1.23 Å', '12.3 nm', '12.3 Å', 1, 'λ = h/√(2meV) = 12.27/√V Å = 12.27/√100 = 1.227 Å ≈ 1.23 Å.', 'Physics', 'hard'),
  ('phy8', 'In a Young''s double slit experiment, the fringe width is found to be 0.4 mm. If the whole apparatus is immersed in water (μ = 4/3), the new fringe width will be:', '0.3 mm', '0.53 mm', '0.6 mm', '0.8 mm', 1, 'Fringe width β = λD/d. In water, λ reduces by factor μ. New β = β/μ = 0.4/(4/3) = 0.3 mm.', 'Physics', 'hard'),
  ('phy9', 'A body weighs 63 N on the surface of the earth. At a height equal to half the radius of earth, its weight will be:', '28 N', '31.5 N', '14 N', '7 N', 1, 'g'' = g × R²/(R+h)² = g × R²/(3R/2)² = g × 4/9. Weight = 63 × 4/9 = 28 N.', 'Physics', 'medium'),
  ('phy10', 'The dimensional formula of Planck''s constant is:', '[ML²T⁻¹]', '[ML²T⁻²]', '[MLT⁻¹]', '[ML⁻¹T⁻¹]', 1, 'Planck''s constant h has units of J·s = kg·m²·s⁻²·s = kg·m²·s⁻¹, so the dimensional formula is [ML²T⁻¹].', 'Physics', 'medium');

-- CHEMISTRY (10 questions)
INSERT OR IGNORE INTO Question (id, text, optionA, optionB, optionC, optionD, correct, explanation, subject, difficulty)
VALUES
  ('chem1', 'The IUPAC name of CH₃-CH(OH)-CH₃ is:', 'Propan-1-ol', 'Propan-2-ol', 'Isopropyl alcohol only', '2-Methyl ethanol', 2, 'CH₃-CH(OH)-CH₃ is propan-2-ol (IUPAC name). The -OH group is on the second carbon of a three-carbon chain.', 'Chemistry', 'easy'),
  ('chem2', 'Which of the following has the highest ionization energy?', 'Na', 'Mg', 'Al', 'Ne', 4, 'Neon (Ne) is a noble gas with a complete octet, making it extremely difficult to remove an electron. It has the highest ionization energy among the given options.', 'Chemistry', 'easy'),
  ('chem3', 'The hybridization of carbon in methane (CH₄) is:', 'sp', 'sp²', 'sp³', 'sp³d', 3, 'In methane, carbon forms 4 sigma bonds with hydrogen atoms, requiring 4 hybrid orbitals. This is achieved through sp³ hybridization.', 'Chemistry', 'easy'),
  ('chem4', 'What is the pH of a 0.001 M HCl solution?', '1', '2', '3', '4', 3, 'HCl is a strong acid that dissociates completely. [H⁺] = 0.001 M = 10⁻³ M. pH = -log(10⁻³) = 3.', 'Chemistry', 'easy'),
  ('chem5', 'In the reaction N₂ + 3H₂ → 2NH₃, if 28g of N₂ reacts with 6g of H₂, the limiting reagent is:', 'N₂', 'H₂', 'Both react completely', 'Neither', 2, 'Moles of N₂ = 28/28 = 1 mol. Moles of H₂ = 6/2 = 3 mol. Required H₂ for 1 mol N₂ = 3 mol. Since stoichiometry is balanced, both react completely in ideal conditions. However, H₂ is typically the limiting reagent.', 'Chemistry', 'medium'),
  ('chem6', 'The oxidation state of Mn in KMnO₄ is:', '+4', '+5', '+6', '+7', 4, 'Let oxidation state of Mn = x. K(+1) + Mn(x) + 4O(-2) = 0. 1 + x - 8 = 0, x = +7.', 'Chemistry', 'easy'),
  ('chem7', 'Which of the following is the strongest acid?', 'HF', 'HCl', 'HBr', 'HI', 4, 'Among hydrogen halides, acidity increases down the group due to decreasing bond strength. HI has the weakest H-I bond, making it the strongest acid.', 'Chemistry', 'medium'),
  ('chem8', 'The number of sigma and pi bonds in benzene are respectively:', '6, 3', '12, 3', '9, 3', '12, 6', 2, 'Benzene has 6 C-C sigma bonds, 6 C-H sigma bonds = 12 sigma bonds. It has 3 delocalized pi bonds in the ring.', 'Chemistry', 'medium'),
  ('chem9', 'The crystal field splitting energy (Δ₀) for [Fe(CN)₆]³⁻ is higher than [FeF₆]³⁻ because:', 'CN⁻ is a weak field ligand', 'CN⁻ is a strong field ligand', 'F⁻ has greater charge', 'Fe³⁺ changes oxidation state', 2, 'CN⁻ is a strong field ligand (high in spectrochemical series) and causes large crystal field splitting. F⁻ is a weak field ligand with smaller splitting.', 'Chemistry', 'hard'),
  ('chem10', 'The rate constant of a first-order reaction is 0.0693 min⁻¹. The half-life of the reaction is:', '10 min', '100 min', '20 min', '50 min', 1, 'For first-order reaction, t½ = 0.693/k = 0.693/0.0693 = 10 min.', 'Chemistry', 'medium');

-- BIOLOGY (10 questions)
INSERT OR IGNORE INTO Question (id, text, optionA, optionB, optionC, optionD, correct, explanation, subject, difficulty)
VALUES
  ('bio1', 'The powerhouse of the cell is:', 'Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus', 3, 'Mitochondria are called the powerhouse of the cell because they produce ATP (energy currency) through cellular respiration.', 'Biology', 'easy'),
  ('bio2', 'DNA replication is described as:', 'Conservative', 'Semi-conservative', 'Dispersive', 'Random', 2, 'DNA replication is semi-conservative, as proved by Meselson and Stahl experiment. Each new DNA molecule has one old strand and one new strand.', 'Biology', 'easy'),
  ('bio3', 'Which of the following is NOT a function of the liver?', 'Bile production', 'Detoxification', 'Insulin production', 'Glycogen storage', 3, 'Insulin is produced by the beta cells of the pancreas, not the liver. The liver produces bile, detoxifies substances, and stores glycogen.', 'Biology', 'easy'),
  ('bio4', 'The process of conversion of sugar into alcohol by yeast is called:', 'Respiration', 'Fermentation', 'Photosynthesis', 'Digestion', 2, 'Fermentation is the anaerobic process by which yeast converts sugars (glucose) into ethanol and carbon dioxide.', 'Biology', 'easy'),
  ('bio5', 'In Mendel''s monohybrid cross, the phenotypic ratio in F2 generation is:', '1:2:1', '3:1', '1:1', '9:3:3:1', 2, 'In a monohybrid cross, the F2 generation shows a phenotypic ratio of 3 dominant : 1 recessive = 3:1.', 'Biology', 'easy'),
  ('bio6', 'The oxygen evolved during photosynthesis comes from:', 'CO₂', 'H₂O', 'Both CO₂ and H₂O', 'Glucose', 2, 'The oxygen evolved during photosynthesis comes from the photolysis (splitting) of water molecules, not from CO₂. This was proved by Ruben and Kamen using ¹⁸O.', 'Biology', 'medium'),
  ('bio7', 'Which of the following hormones is secreted by the adrenal medulla?', 'Cortisol', 'Aldosterone', 'Adrenaline', 'ACTH', 3, 'The adrenal medulla secretes adrenaline (epinephrine) and noradrenaline (norepinephrine), which are emergency hormones (fight or flight response).', 'Biology', 'medium'),
  ('bio8', 'The number of chromosomes in a human somatic cell is:', '23', '44', '46', '48', 3, 'Human somatic (body) cells are diploid (2n) and contain 46 chromosomes (23 pairs). Gametes are haploid with 23 chromosomes.', 'Biology', 'easy'),
  ('bio9', 'Which enzyme unwinds the DNA double helix during replication?', 'DNA polymerase', 'Ligase', 'Helicase', 'Primase', 3, 'Helicase is the enzyme that unwinds the DNA double helix by breaking hydrogen bonds between base pairs at the replication fork.', 'Biology', 'medium'),
  ('bio10', 'The functional unit of the kidney is called:', 'Neuron', 'Nephron', 'Alveolus', 'Sarcomere', 2, 'The nephron is the functional unit of the kidney. Each kidney contains about 1 million nephrons responsible for filtration, reabsorption, and secretion.', 'Biology', 'easy');

-- MATHS (10 questions)
INSERT OR IGNORE INTO Question (id, text, optionA, optionB, optionC, optionD, correct, explanation, subject, difficulty)
VALUES
  ('math1', 'The derivative of sin(x²) with respect to x is:', 'cos(x²)', '2x·cos(x²)', 'x²·cos(x²)', '2·sin(x)·cos(x)', 2, 'Using chain rule: d/dx[sin(x²)] = cos(x²) · d/dx(x²) = cos(x²) · 2x = 2x·cos(x²).', 'Maths', 'easy'),
  ('math2', 'The value of ∫₀¹ x² dx is:', '1/2', '1/3', '1/4', '1', 2, '∫₀¹ x² dx = [x³/3]₀¹ = (1/3) - 0 = 1/3.', 'Maths', 'easy'),
  ('math3', 'If A is a 2×2 matrix with |A| = 5, then |3A| is:', '15', '30', '45', '225', 3, 'For a 2×2 matrix, |kA| = k²|A|. So |3A| = 3² × 5 = 9 × 5 = 45.', 'Maths', 'medium'),
  ('math4', 'The general solution of the differential equation dy/dx = y/x is:', 'y = kx', 'y = k/x', 'y = kx²', 'y = ke^x', 1, 'dy/y = dx/x. Integrating: ln|y| = ln|x| + ln|k|. So y = kx.', 'Maths', 'medium'),
  ('math5', 'The value of lim(x→0) sin(x)/x is:', '0', '1', '∞', 'Undefined', 2, 'This is a standard limit. lim(x→0) sin(x)/x = 1. This can be proved using the squeeze theorem or L''Hôpital''s rule.', 'Maths', 'easy'),
  ('math6', 'Two vectors a⃗ and b⃗ are perpendicular if:', '|a⃗| = |b⃗|', 'a⃗ · b⃗ = 1', 'a⃗ · b⃗ = 0', 'a⃗ × b⃗ = 0', 3, 'Two vectors are perpendicular (orthogonal) when their dot product equals zero: a⃗ · b⃗ = |a⃗||b⃗|cos90° = 0.', 'Maths', 'easy'),
  ('math7', 'The sum of the first n terms of an AP is 3n² + 5n. The 10th term is:', '58', '62', '65', '350', 2, 'Sₙ = 3n² + 5n. aₙ = Sₙ - Sₙ₋₁ = (3n² + 5n) - [3(n-1)² + 5(n-1)] = 6n + 2. So a₁₀ = 60 + 2 = 62.', 'Maths', 'medium'),
  ('math8', 'If f(x) = x³ - 3x² + 2, then the point of inflection is at:', 'x = 0', 'x = 1', 'x = 2', 'x = 3', 2, 'f''''(x) = 6x - 6 = 0 gives x = 1. At x = 1, the sign of f''''(x) changes, so it''s a point of inflection.', 'Maths', 'medium'),
  ('math9', 'The number of 4-digit numbers that can be formed using digits 1, 2, 3, 4, 5 (repetition allowed) such that the number is divisible by 4 is:', '100', '125', '150', '175', 2, 'A number is divisible by 4 if its last two digits form a number divisible by 4. There are 5 choices for each of the first two digits and for the last two digits, the divisible-by-4 pairs from {1,2,3,4,5} are: 12, 24, 32, 44, 52 — that''s 5 pairs. Total = 5 × 5 × 5 = 125.', 'Maths', 'hard'),
  ('math10', 'The area bounded by the curve y = x², x-axis, x = 0 and x = 2 is:', '4/3 sq units', '8/3 sq units', '2 sq units', '4 sq units', 2, 'Area = ∫₀² x² dx = [x³/3]₀² = 8/3 - 0 = 8/3 sq units.', 'Maths', 'medium');
