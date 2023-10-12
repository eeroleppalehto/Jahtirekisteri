-- View for sankey diagram that show how much meat each member has received kilos

CREATE OR REPLACE VIEW public.sankey_jasen_jako_kg
 AS
 SELECT seurue.seurueen_nimi AS source,
    (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS target,
    sum(jakotapahtuma_jasen.maara) AS value
   FROM jasenyys
     JOIN seurue ON jasenyys.seurue_id = seurue.seurue_id
     JOIN jakotapahtuma_jasen ON jasenyys.jasenyys_id = jakotapahtuma_jasen.jasenyys_id
     JOIN jasen ON jasenyys.jasen_id = jasen.jasen_id
  WHERE seurue.seurue_tyyppi_id = 2
  GROUP BY seurue.seurueen_nimi, ((jasen.sukunimi::text || ' '::text) || jasen.etunimi::text);

ALTER TABLE public.sankey_jasen_jako_kg
    OWNER TO postgres;
COMMENT ON VIEW public.sankey_jasen_jako_kg
    IS 'Näkymä, joka antaa seureen, jäsenen ja jäsenelle annetun lihan kiloissa';

GRANT ALL ON TABLE public.sankey_jasen_jako_kg TO application;
GRANT ALL ON TABLE public.sankey_jasen_jako_kg TO postgres;

