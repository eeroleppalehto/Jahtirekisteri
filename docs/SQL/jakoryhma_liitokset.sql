CREATE VIEW public.jakoryhma_liitokset
AS
SELECT public.jakotapahtuma.ryhma_id FROM public.jakotapahtuma
UNION
SELECT public.jasenyys.ryhma_id FROM public.jasenyys