-- Update the view to include only active memberships by checking if the poistui field is null.

CREATE OR REPLACE VIEW public.ryhmien_osuudet
    AS
     SELECT jasenyys.ryhma_id,
    sum(jasenyys.osuus)::double precision / 100::real AS jakokerroin
   FROM jasenyys
   WHERE jasenyys.poistui IS NULL
  GROUP BY jasenyys.ryhma_id
  ORDER BY jasenyys.ryhma_id;