-- Update the view jakoryhma_yhteenveto to check whether the poistui field is null.

CREATE OR REPLACE VIEW public.jakoryhma_yhteenveto
    AS
     SELECT jakoryhma.ryhman_nimi AS "Ryhmä",
    count(jasenyys.jasen_id) AS "Jäseniä",
    sum(jasenyys.osuus)::double precision / 100::real AS "Osuus Summa"
   FROM jakoryhma
     LEFT JOIN jasenyys ON jasenyys.ryhma_id = jakoryhma.ryhma_id
  WHERE jasenyys.poistui IS NULL
  GROUP BY jakoryhma.ryhman_nimi
  ORDER BY jakoryhma.ryhman_nimi;