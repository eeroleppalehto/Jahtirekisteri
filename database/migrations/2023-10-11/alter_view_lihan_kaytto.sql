-- Added fixes on line 11 to make the calculation correct.
-- For this script to work, first the view seurue_sankey must be dropped as it depends on the view lihan_kaytto
-- and would block the drop of lihan_kaytto.

DROP VIEW public.sankey_elain_kasittely_seurue;

DROP VIEW public.lihan_kaytto;

CREATE OR REPLACE VIEW public.lihan_kaytto
    AS
    SELECT kaato.elaimen_nimi AS source,
	kasittely.kasittely_teksti AS target,
	sum(kaato.ruhopaino*kaadon_kasittely.kasittely_maara::float/100.0) AS value
FROM kaadon_kasittely
	JOIN kaato ON kaadon_kasittely.kaato_id = kaato.kaato_id
	JOIN kasittely ON kaadon_kasittely.kasittelyid = kasittely.kasittelyid
GROUP BY kaato.elaimen_nimi, kasittely.kasittely_teksti;

ALTER TABLE public.lihan_kaytto
    OWNER TO postgres;
GRANT ALL ON TABLE public.lihan_kaytto TO application;
GRANT ALL ON TABLE public.lihan_kaytto TO postgres;

CREATE OR REPLACE VIEW public.sankey_elain_kasittely_seurue
 AS
 SELECT lihan_kaytto.source,
    lihan_kaytto.target,
    lihan_kaytto.value
   FROM lihan_kaytto
UNION
 SELECT seurue_sankey.source,
    seurue_sankey.target,
    seurue_sankey.sum AS value
   FROM seurue_sankey;

ALTER TABLE public.sankey_elain_kasittely_seurue
    OWNER TO postgres;

GRANT ALL ON TABLE public.sankey_elain_kasittely_seurue TO application;
GRANT ALL ON TABLE public.sankey_elain_kasittely_seurue TO postgres;