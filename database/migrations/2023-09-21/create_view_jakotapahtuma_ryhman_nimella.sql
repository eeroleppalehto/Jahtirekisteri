CREATE OR REPLACE VIEW public.jakotapahtuma_ryhman_nimella
 AS
 SELECT jakotapahtuma.tapahtuma_id AS "Jako",
    jakotapahtuma.paiva AS pvm,
    jakotapahtuma.ryhma_id AS "Ryhmä ID",
    jakoryhma.ryhman_nimi AS "Ryhmän Nimi",
    jakotapahtuma.osnimitys AS "Ruhonosa",
    jakotapahtuma.kaadon_kasittely_id AS "Kaadon kasittely ID",
    jakotapahtuma.maara AS "Paino",
    kaadon_kasittely.kaato_id AS "Kaato ID"
   FROM jakotapahtuma
     JOIN jakoryhma ON jakoryhma.ryhma_id = jakotapahtuma.ryhma_id
     JOIN kaadon_kasittely ON kaadon_kasittely.kaadon_kasittely_id = jakotapahtuma.kaadon_kasittely_id;