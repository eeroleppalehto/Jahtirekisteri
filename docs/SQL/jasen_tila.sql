-- View: public.jasen_tila

-- DROP VIEW public.jasen_tila;

CREATE OR REPLACE VIEW public.jasen_tila
 AS
 SELECT (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS nimi,
    jasen.tila
   FROM jasen
  ORDER BY ((jasen.sukunimi::text || ' '::text) || jasen.etunimi::text);

ALTER TABLE public.jasen_tila
    OWNER TO postgres;

GRANT ALL ON TABLE public.jasen_tila TO application;
GRANT ALL ON TABLE public.jasen_tila TO postgres;