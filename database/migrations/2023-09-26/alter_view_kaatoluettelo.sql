-- Added column "kaato_id" to table "kaato" for sorting the table based on it in desktop application

CREATE OR REPLACE VIEW public.kaatoluettelo
 AS
 SELECT (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS "Kaataja",
    kaato.kaatopaiva AS "Kaatopäivä",
    kaato.paikka_teksti AS "Paikka",
    kaato.elaimen_nimi AS "Eläin",
    kaato.ikaluokka AS "Ikäluokka",
    kaato.sukupuoli AS "Sukupuoli",
    kaato.ruhopaino AS "Paino",
    kaato.kaato_id AS "Kaato ID",
    count(kaadon_kasittely.kaato_id) AS "Käsittelyt"
   FROM kaato
     JOIN jasen ON jasen.jasen_id = kaato.jasen_id
     JOIN kaadon_kasittely ON kaato.kaato_id = kaadon_kasittely.kaato_id
  GROUP BY ((jasen.sukunimi::text || ' '::text) || jasen.etunimi::text), kaato.kaatopaiva, kaato.paikka_teksti, kaato.elaimen_nimi, kaato.ikaluokka, kaato.sukupuoli, kaato.ruhopaino, kaato.kaato_id
  ORDER BY kaato.kaato_id DESC;