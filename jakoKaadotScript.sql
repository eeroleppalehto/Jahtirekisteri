-- View: public.jako_kaadot

-- DROP VIEW public.jako_kaadot;

CREATE OR REPLACE VIEW public.jako_kaadot
 AS
 SELECT (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS kaataja,
    kaato.kaatopaiva AS "kaatopäivä",
    kaato.paikka_teksti AS paikka,
    kaato.elaimen_nimi AS "eläin",
    kaato.ikaluokka AS "ikaryhmä",
    kaato.sukupuoli,
    kasittely.kasittely_teksti AS "käyttö",
    kaato.ruhopaino AS paino
   FROM jasen
     JOIN kaato ON jasen.jasen_id = kaato.jasen_id
     JOIN kasittely ON kaato.kasittelyid = kasittely.kasittelyid
  WHERE kaato.kasittelyid = 2
  ORDER BY kaato.kaato_id DESC;

ALTER TABLE public.jako_kaadot
    OWNER TO application;

GRANT ALL ON TABLE public.jako_kaadot TO application;