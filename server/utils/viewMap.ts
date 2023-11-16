import { queryBuilder } from "./queryBuilder";

type Params = {
    column: string | number;
    value: number;
};

type QueryBuilder = (params: Params) => string;

export const viewMap = new Map<string, QueryBuilder>([
    [
        "jaetut_lihat",
        queryBuilder`SELECT * FROM jaetut_lihat WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jaetut_ruhon_osat",
        queryBuilder`SELECT * FROM jaetut_ruhon_osat WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jaetut_ruhon_osat_jasenille",
        queryBuilder`SELECT * FROM jaetut_ruhon_osat_jasenille WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jako_kaadot",
        queryBuilder`SELECT * FROM jako_kaadot WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jako_kaadot_jasenille",
        queryBuilder`SELECT * FROM jako_kaadot_jasenille WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jakoryhma_osuus_maara",
        queryBuilder`SELECT * FROM jakoryhma_osuus_maara WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jakoryhma_seurueen_nimella",
        queryBuilder`SELECT * FROM jakoryhma_seurueen_nimella WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jakoryhma_yhteenveto",
        queryBuilder`SELECT * FROM jakoryhma_yhteenveto WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jakotapahtuma_jasen_jasen_nimella",
        queryBuilder`SELECT * FROM jakotapahtuma_jasen_jasen_nimella WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jakotapahtuma_ryhman_nimella",
        queryBuilder`SELECT * FROM jakotapahtuma_ryhman_nimella WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jasen_tila",
        queryBuilder`SELECT * FROM jasen_tila WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jasenyys_nimella",
        queryBuilder`SELECT * FROM jasenyys_nimella WHERE ${"column"} = ${"value"}`,
    ],
    [
        "jasenyys_nimella_ryhmalla",
        queryBuilder`SELECT * FROM jasenyys_nimella_ryhmalla WHERE ${"column"} = ${"value"}`,
    ],
    [
        "kaatoluettelo",
        queryBuilder`SELECT * FROM kaatoluettelo WHERE ${"column"} = ${"value"}`,
    ],
    [
        "kaatoluettelo_indeksilla",
        queryBuilder`SELECT * FROM kaatoluettelo_indeksilla WHERE ${"column"} = ${"value"}`,
    ],
    [
        "lihan_kaytto",
        queryBuilder`SELECT * FROM lihan_kaytto WHERE ${"column"} = ${"value"}`,
    ],
    [
        "luvat_kayttamatta_kpl_pros",
        queryBuilder`SELECT * FROM luvat_kayttamatta_kpl_pros WHERE ${"column"} = ${"value"}`,
    ],
    [
        "nimivalinta",
        queryBuilder`SELECT * FROM nimivalinta WHERE ${"column"} = ${"value"}`,
    ],
    [
        "ryhmat_jasenilla",
        queryBuilder`SELECT * FROM ryhmat_jasenilla WHERE ${"column"} = ${"value"}`,
    ],
    [
        "ryhmien_osuudet",
        queryBuilder`SELECT * FROM ryhmien_osuudet WHERE ${"column"} = ${"value"}`,
    ],
    [
        "sankey_elain_kasittely_seurue",
        queryBuilder`SELECT * FROM sankey_elain_kasittely_seurue WHERE ${"column"} = ${"value"}`,
    ],
    [
        "sankey_jasen_jako_kg",
        queryBuilder`SELECT * FROM sankey_jasen_jako_kg WHERE ${"column"} = ${"value"}`,
    ],
    [
        "sankey_jasen_jako_kpl",
        queryBuilder`SELECT * FROM sankey_jasen_jako_kpl WHERE ${"column"} = ${"value"}`,
    ],
    [
        "seurue_lihat",
        queryBuilder`SELECT * FROM seurue_lihat WHERE ${"column"} = ${"value"}`,
    ],
    [
        "seurue_lihat_osuus",
        queryBuilder`SELECT * FROM seurue_lihat_osuus WHERE ${"column"} = ${"value"}`,
    ],
    [
        "seurue_ryhmilla",
        queryBuilder`SELECT * FROM seurue_ryhmilla WHERE ${"column"} = ${"value"}`,
    ],
    [
        "seurue_sankey",
        queryBuilder`SELECT * FROM seurue_sankey WHERE ${"column"} = ${"value"}`,
    ],
]);

viewMap.set(
    "mobiili_ryhma_sivu",
    queryBuilder`
    SELECT jakoryhma.ryhma_id,
        jakoryhma.ryhman_nimi,
        jakoryhma.seurue_id,
        seurue.seurueen_nimi,
        count(jasenyys.jasen_id)::integer AS "Jäseniä",
        sum(jasenyys.osuus)::double precision / 100::real AS "Osuus Summa"
    FROM jakoryhma
    JOIN seurue ON jakoryhma.seurue_id = seurue.seurue_id
        LEFT JOIN jasenyys ON jasenyys.ryhma_id = jakoryhma.ryhma_id
    WHERE ${"column"} = ${"value"}
    GROUP BY jakoryhma.ryhma_id,
        jakoryhma.ryhman_nimi,
        jakoryhma.seurue_id,
        seurue.seurueen_nimi`
);
