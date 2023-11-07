-- Added column that calculates the percentage of the kill shared

DROP VIEW public.jako_kaadot;

CREATE OR REPLACE VIEW public.jako_kaadot
    AS
     SELECT kaadon_kasittely.kaato_id AS "KaatoID",
    kaadon_kasittely.kasittely_maara AS "Jako Määrä(%)",
	sum(ruhonosa.osnimitys_suhdeluku)*10000/kaadon_kasittely.kasittely_maara AS "Jaettu (%)",
    (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS "Kaataja",
    kaato.kaatopaiva AS "kaatopäivä",
    kaato.paikka_teksti AS "Paikka",
    kaato.elaimen_nimi AS "Eläin",
    kaato.ikaluokka AS "Ikäluokka",
    kaato.sukupuoli AS "Sukupuoli",
    kasittely.kasittely_teksti AS "Käyttö",
    kaato.ruhopaino AS "Paino",
    kaadon_kasittely.kaadon_kasittely_id
   FROM jasen
     JOIN kaato ON jasen.jasen_id = kaato.jasen_id
     JOIN kaadon_kasittely ON kaadon_kasittely.kaato_id = kaato.kaato_id
     JOIN kasittely ON kaadon_kasittely.kasittelyid = kasittely.kasittelyid
	 LEFT JOIN jakotapahtuma ON jakotapahtuma.kaadon_kasittely_id = kaadon_kasittely.kaadon_kasittely_id
	 LEFT JOIN ruhonosa ON ruhonosa.osnimitys = jakotapahtuma.osnimitys
  WHERE kaadon_kasittely.kasittelyid = 2
  GROUP BY "KaatoID", "Jako Määrä(%)", "Kaataja", "kaatopäivä", "Paikka", "Eläin", "Ikäluokka", "Sukupuoli", "Käyttö", "Paino", kaadon_kasittely.kaadon_kasittely_id
  ORDER BY kaadon_kasittely.kaato_id DESC;
