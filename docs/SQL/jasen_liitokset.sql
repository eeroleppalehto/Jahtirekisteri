CREATE VIEW public.jasen_liitokset
AS
SELECT public.jasenyys.jasen_id FROM public.jasenyys
UNION
SELECT public.seurue.jasen_id FROM public.seurue
UNION
SELECT public.kaato.jasen_id FROM public.kaato