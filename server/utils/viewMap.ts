export const viewMap = new Map<string, string>([
    ["jaetut_lihat", "SELECT * FROM jaetut_lihat"],
    ["jaetut_ruhon_osat", "SELECT * FROM jaetut_ruhon_osat"],
    [
        "jaetut_ruhon_osat_jasenille",
        "SELECT * FROM jaetut_ruhon_osat_jasenille",
    ],
    ["jako_kaadot", "SELECT * FROM jako_kaadot"],
    ["jako_kaadot_jasenille", "SELECT * FROM jako_kaadot_jasenille"],
    ["jakoryhma_osuus_maara", "SELECT * FROM jakoryhma_osuus_maara"],
    ["jakoryhma_seurueen_nimella", "SELECT * FROM jakoryhma_seurueen_nimella"],
    ["jakoryhma_yhteenveto", "SELECT * FROM jakoryhma_yhteenveto"],
    [
        "jakotapahtuma_jasen_jasen_nimella",
        "SELECT * FROM jakotapahtuma_jasen_jasen_nimella",
    ],
    [
        "jakotapahtuma_ryhman_nimella",
        "SELECT * FROM jakotapahtuma_ryhman_nimella",
    ],
    ["jasen_tila", "SELECT * FROM jasen_tila"],
    ["jasenyys_nimella", "SELECT * FROM jasenyys_nimella"],
    ["jasenyys_nimella_ryhmalla", "SELECT * FROM jasenyys_nimella_ryhmalla"],
    ["kaatoluettelo", "SELECT * FROM kaatoluettelo"],
    ["kaatoluettelo_indeksilla", "SELECT * FROM kaatoluettelo_indeksilla"],
    ["lihan_kaytto", "SELECT * FROM lihan_kaytto"],
    ["luvat_kayttamatta_kpl_pros", "SELECT * FROM luvat_kayttamatta_kpl_pros"],
    ["nimivalinta", "SELECT * FROM nimivalinta"],
    ["ryhmat_jasenilla", "SELECT * FROM ryhmat_jasenilla"],
    ["ryhmien_osuudet", "SELECT * FROM ryhmien_osuudet"],
    [
        "sankey_elain_kasittely_seurue",
        "SELECT * FROM sankey_elain_kasittely_seurue",
    ],
    ["sankey_jasen_jako_kg", "SELECT * FROM sankey_jasen_jako_kg"],
    ["sankey_jasen_jako_kpl", "SELECT * FROM sankey_jasen_jako_kpl"],
    ["seurue_lihat", "SELECT * FROM seurue_lihat"],
    ["seurue_lihat_osuus", "SELECT * FROM seurue_lihat_osuus"],
    ["seurue_ryhmilla", "SELECT * FROM seurue_ryhmilla"],
    ["seurue_sankey", "SELECT * FROM seurue_sankey"],
]);

// View for the mobile app's group page
viewMap.set(
    "mobiili_ryhma_sivu",
    `SELECT jakoryhma.ryhma_id,
        jakoryhma.ryhman_nimi,
        jakoryhma.seurue_id,
        seurue.seurueen_nimi,
        count(jasenyys.jasen_id)::integer AS "Jäseniä",
        sum(jasenyys.osuus)::double precision / 100::real AS "Osuus Summa"
    FROM jakoryhma
    JOIN seurue ON jakoryhma.seurue_id = seurue.seurue_id
        LEFT JOIN jasenyys ON jasenyys.ryhma_id = jakoryhma.ryhma_id
    WHERE 1 = 1
    GROUP BY jakoryhma.ryhma_id,
        jakoryhma.ryhman_nimi,
        jakoryhma.seurue_id,
        seurue.seurueen_nimi`
);
