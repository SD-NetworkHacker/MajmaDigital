-- 1. MISE A JOUR TABLE PROFILES
-- On s'assure que le champ commissions est bien structuré

-- 2. POLITIQUES RLS POUR meeting_reports
ALTER TABLE public.meeting_reports ENABLE ROW LEVEL SECURITY;

-- Autoriser la lecture totale au SG
CREATE POLICY "Le SG voit tous les rapports de réunion" 
ON public.meeting_reports FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SG'));

-- Autoriser l'écriture uniquement aux membres de la commission
CREATE POLICY "Seuls les membres écrivent dans leur commission" 
ON public.meeting_reports FOR ALL 
USING (commission = ANY (SELECT jsonb_array_elements_text(commissions->'type') FROM public.profiles WHERE id = auth.uid()));

-- 3. POLITIQUES RLS POUR budget_requests
ALTER TABLE public.budget_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Le SG voit tous les budgets" 
ON public.budget_requests FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'SG'));

CREATE POLICY "Membres commission gèrent leurs budgets" 
ON public.budget_requests FOR ALL 
USING (commission = ANY (SELECT jsonb_array_elements_text(commissions->'type') FROM public.profiles WHERE id = auth.uid()));