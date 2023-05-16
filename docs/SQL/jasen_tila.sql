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

-- View: public.ryhmat_jasenilla

-- DROP VIEW public.ryhmat_jasenilla;

CREATE OR REPLACE VIEW public.ryhmat_jasenilla
 AS
 SELECT jakoryhma.ryhman_nimi,
    (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS nimi,
    jasenyys.liittyi,
    jasenyys.poistui,
    jasenyys.osuus
   FROM jasenyys
     JOIN jasen ON jasenyys.jasen_id = jasen.jasen_id
     JOIN jakoryhma ON jakoryhma.ryhma_id = jasenyys.ryhma_id
  ORDER BY jakoryhma.ryhman_nimi;

ALTER TABLE public.ryhmat_jasenilla
    OWNER TO postgres;
COMMENT ON VIEW public.ryhmat_jasenilla
    IS 'Näkymä joka näyttää ryhmä, jäsen, liittymispvm(,poistumispvm), osuus';

GRANT ALL ON TABLE public.ryhmat_jasenilla TO application;
GRANT ALL ON TABLE public.ryhmat_jasenilla TO postgres;

