-- Update the view seurue_lihat_osuus to check wheather the poistui field is null.

CREATE OR REPLACE VIEW public.seurue_lihat_osuus
    AS
    SELECT seurue.seurue_id,
    seurue.seurueen_nimi,
    seurue_lihat.sum AS maara,
    sum(jasenyys.osuus)::real / 100::real AS osuus
   FROM seurue
     JOIN jakoryhma ON jakoryhma.seurue_id = seurue.seurue_id
     JOIN jasenyys ON jasenyys.ryhma_id = jakoryhma.ryhma_id
     JOIN seurue_lihat ON seurue_lihat.seurue_id = seurue.seurue_id
	WHERE jasenyys.poistui IS NULL
  GROUP BY seurue.seurue_id, seurue.seurueen_nimi, seurue_lihat.sum;
