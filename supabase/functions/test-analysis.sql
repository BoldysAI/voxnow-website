-- Test SQL scripts for the voicemail analysis system
-- Run these in your Supabase SQL Editor to test the analysis pipeline

-- 1. Create a test user (if needed)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'test@voxnow.be',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Create corresponding public user record
INSERT INTO public.users (
  id,
  email,
  full_name,
  created_at
) 
SELECT 
  id,
  email,
  'Test User',
  created_at
FROM auth.users 
WHERE email = 'test@voxnow.be'
ON CONFLICT (email) DO NOTHING;

-- 2. Test voicemail insertions with different scenarios

-- Test Case 1: Family Law - Urgent Divorce
INSERT INTO voicemails (
  user_id,
  caller_phone_number,
  transcription,
  ai_summary,
  received_at,
  status,
  duration_seconds
) VALUES (
  (SELECT id FROM public.users WHERE email = 'test@voxnow.be' LIMIT 1),
  '+32491234567',
  'Bonjour Maître, je m''appelle Marie Dubois. Mon mari m''a quittée hier et je dois absolument divorcer rapidement. Il a vidé notre compte en banque et menace de partir avec les enfants. C''est très urgent, pouvez-vous me rappeler aujourd''hui s''il vous plaît ? Mon numéro est le 0491234567. Merci beaucoup.',
  'Urgence divorce - mari parti avec argent et menace d''emmener les enfants',
  NOW() - INTERVAL '30 minutes',
  'new',
  85
);

-- Test Case 2: Contract Law - Document Review
INSERT INTO voicemails (
  user_id,
  caller_phone_number,
  transcription,
  ai_summary,
  received_at,
  status,
  duration_seconds
) VALUES (
  (SELECT id FROM public.users WHERE email = 'test@voxnow.be' LIMIT 1),
  '+32475987654',
  'Bonjour, c''est Pierre Martin de l''entreprise TechBelgium. Nous avons reçu votre analyse du contrat de partenariat. Globalement c''est correct mais nous avons quelques questions sur les clauses 7 et 12. Pourriez-vous nous rappeler pour planifier un rendez-vous cette semaine ? Nous devons finaliser cela avant vendredi. Merci.',
  'Suivi contrat de partenariat - questions sur clauses spécifiques',
  NOW() - INTERVAL '2 hours',
  'new',
  52
);

-- Test Case 3: Payment Inquiry - Neutral
INSERT INTO voicemails (
  user_id,
  caller_phone_number,
  transcription,
  ai_summary,
  received_at,
  status,
  duration_seconds
) VALUES (
  (SELECT id FROM public.users WHERE email = 'test@voxnow.be' LIMIT 1),
  '+32487654321',
  'Bonjour, c''est Sophie Legrand. Je vous appelle concernant la facture de consultation du mois dernier. Je n''ai pas reçu de facture et je souhaiterais régulariser ma situation. Pouvez-vous vérifier et m''envoyer la facture par email ? Mon adresse est sophie.legrand@email.com. Merci et bonne journée.',
  'Demande de facture pour consultation précédente',
  NOW() - INTERVAL '1 day',
  'new',
  38
);

-- Test Case 4: Employment Law - Workplace Harassment
INSERT INTO voicemails (
  user_id,
  caller_phone_number,
  transcription,
  ai_summary,
  received_at,
  status,
  duration_seconds
) VALUES (
  (SELECT id FROM public.users WHERE email = 'test@voxnow.be' LIMIT 1),
  '+32470123456',
  'Bonjour Maître, je suis Lucas Van Der Berg. Je travaille chez DataCorp depuis 3 ans et je subis du harcèlement de la part de mon manager. Il me fait des remarques déplacées et m''impose des heures supplémentaires non payées. La situation devient intenable et affecte ma santé mentale. J''ai gardé des preuves. Pouvez-vous m''aider ? C''est vraiment urgent car je ne peux plus supporter cette situation.',
  'Harcèlement au travail par manager - situation urgente avec preuves',
  NOW() - INTERVAL '4 hours',
  'new',
  78
);

-- 3. Check if analyses were created (wait a few moments after insert)
SELECT 
  v.id,
  v.caller_phone_number,
  v.transcription,
  v.status,
  COUNT(va.id) as analysis_count
FROM voicemails v
LEFT JOIN voicemail_analysis va ON v.voicemail_id = va.voicemail_id
WHERE v.user_id = (SELECT id FROM public.users WHERE email = 'test@voxnow.be' LIMIT 1)
GROUP BY v.id, v.caller_phone_number, v.transcription, v.status
ORDER BY v.received_at DESC;

-- 4. View detailed analysis results
SELECT 
  v.transcription,
  va.analysis_type,
  va.analysis_result,
  va.confidence_score,
  va.ai_model_name,
  va.processing_time_ms,
  va.created_at
FROM voicemails v
JOIN voicemail_analysis va ON v.id = va.voicemail_id
WHERE v.user_id = (SELECT id FROM public.users WHERE email = 'test@voxnow.be' LIMIT 1)
ORDER BY v.received_at DESC, va.analysis_type;

-- 5. Summary view of all analyses
SELECT 
  analysis_type,
  analysis_result,
  COUNT(*) as frequency,
  AVG(confidence_score) as avg_confidence,
  AVG(processing_time_ms) as avg_processing_time_ms
FROM voicemail_analysis va
JOIN voicemails v ON va.voicemail_id = v.id
WHERE v.user_id = (SELECT id FROM public.users WHERE email = 'test@voxnow.be' LIMIT 1)
GROUP BY analysis_type, analysis_result
ORDER BY analysis_type, frequency DESC;

-- 6. Clean up test data (uncomment to use)
/*
DELETE FROM voicemail_analysis 
WHERE voicemail_id IN (
  SELECT id FROM voicemails 
  WHERE user_id = (SELECT id FROM public.users WHERE email = 'test@voxnow.be' LIMIT 1)
);

DELETE FROM voicemails 
WHERE user_id = (SELECT id FROM public.users WHERE email = 'test@voxnow.be' LIMIT 1);

DELETE FROM public.users WHERE email = 'test@voxnow.be';
DELETE FROM auth.users WHERE email = 'test@voxnow.be';
*/
