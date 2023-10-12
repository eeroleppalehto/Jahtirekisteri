-- Create view for sankey diagram that shows how many meats each member has received

CREATE OR REPLACE VIEW public.sankey_jasen_jako_kpl
 AS
 SELECT seurue.seurueen_nimi AS source,
    (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS target,
    count(jakotapahtuma_jasen.maara) AS value
   FROM jasenyys
     JOIN seurue ON jasenyys.seurue_id = seurue.seurue_id
     JOIN jakotapahtuma_jasen ON jasenyys.jasenyys_id = jakotapahtuma_jasen.jasenyys_id
     JOIN jasen ON jasenyys.jasen_id = jasen.jasen_id
  WHERE seurue.seurue_tyyppi_id = 2
  GROUP BY seurue.seurueen_nimi, ((jasen.sukunimi::text || ' '::text) || jasen.etunimi::text);

ALTER TABLE public.sankey_jasen_jako_kpl
    OWNER TO postgres;
COMMENT ON VIEW public.sankey_jasen_jako_kpl
    IS 'Näkymä, joka antaa seurueen, jäsenen ja jäsenelle annetut lihat lukumäärissä';

GRANT ALL ON TABLE public.sankey_jasen_jako_kpl TO application;
GRANT ALL ON TABLE public.sankey_jasen_jako_kpl TO postgres;

