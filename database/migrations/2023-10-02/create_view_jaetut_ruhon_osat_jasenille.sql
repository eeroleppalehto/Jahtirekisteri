-- View for showing all the parts of the carcass that have been shared to the members

CREATE OR REPLACE VIEW public.jaetut_ruhon_osat_jasenille
 AS
 SELECT kaato.kaato_id AS "KaatoID",
    kaato.elaimen_nimi AS "Eläin",
    jakotapahtuma_jasen.osnimitys AS "Ruhon osa",
    jakotapahtuma_jasen.maara AS "Määrä",
    kaadon_kasittely.kasittely_maara AS "Käsittelyn Määrä"
   FROM kaato
     JOIN kaadon_kasittely ON kaadon_kasittely.kaato_id = kaato.kaato_id
     JOIN jakotapahtuma_jasen ON jakotapahtuma_jasen.kaadon_kasittely_id = kaadon_kasittely.kaadon_kasittely_id
  ORDER BY kaato.kaato_id DESC;

ALTER TABLE public.jaetut_ruhon_osat_jasenille
    OWNER TO postgres;

GRANT ALL ON TABLE public.jaetut_ruhon_osat_jasenille TO application;
GRANT ALL ON TABLE public.jaetut_ruhon_osat_jasenille TO postgres;