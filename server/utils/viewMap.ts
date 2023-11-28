import { queryBuilder } from "./queryBuilder";

/**
 * This file contains the view map for the database views. This map is used to
 * validate the view name and to build the query for the view.
 *
 * @date 11/20/2023 - 11:12:19 AM
 */
type Params = {
    column: string | number;
    value: number;
};

type QueryBuilder = (params: Params) => string;

// Map for the views. The key is the view name and the value is the query builder
// which returns a function that takes the column and value as parameters and
// returns the query for the view.
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

// View for the GroupScreen in the mobile app
viewMap.set(
    "mobiili_ryhma_sivu",
    queryBuilder`
    SELECT jakoryhma.ryhma_id,
        jakoryhma.ryhman_nimi,
        jakoryhma.seurue_id,
        seurue.seurueen_nimi,
        count(jasenyys.jasen_id)::integer AS jasenia,
        sum(jasenyys.osuus)::double precision / 100::real AS osuus_summa
    FROM jakoryhma
    JOIN seurue ON jakoryhma.seurue_id = seurue.seurue_id
        LEFT JOIN jasenyys ON jasenyys.ryhma_id = jakoryhma.ryhma_id
    WHERE ${"column"} = ${"value"}
    GROUP BY jakoryhma.ryhma_id,
        jakoryhma.ryhman_nimi,
        jakoryhma.seurue_id,
        seurue.seurueen_nimi`
);

// View for the PartyScreen in the mobile app
viewMap.set(
    "mobiili_seurue_sivu",
    queryBuilder`
    SELECT seurue.seurue_id,
        seurue.seurueen_nimi,
        seurue.jasen_id,
        (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS seurueen_johatajan_nimi,
        seurue.seurue_tyyppi_id,
        seurue_tyyppi.seurue_tyyppi_nimi
    FROM seurue
        INNER JOIN jasen ON jasen.jasen_id = seurue.jasen_id
        INNER JOIN seurue_tyyppi ON seurue_tyyppi.seurue_tyyppi_id = seurue.seurue_tyyppi_id
    WHERE ${"column"} = ${"value"};`
);

// View for the ShotScreen in the mobile app
viewMap.set(
    "mobiili_kaato_sivu",
    queryBuilder`
    SELECT kaato.kaato_id,
        kaato.jasen_id,
        (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS kaatajan_nimi,
        kaato.kaatopaiva,
        kaato.ruhopaino,
        kaato.paikka_teksti,
        kaato.paikka_koordinaatti,
        kaato.elaimen_nimi,
        kaato.sukupuoli,
        kaato.ikaluokka,
        kaato.lisatieto
    FROM kaato
	    INNER JOIN jasen ON jasen.jasen_id = kaato.jasen_id
    WHERE ${"column"} = ${"value"};`
);

// View for usages in the mobile app
viewMap.set(
    "mobiili_kaadon_kasittely",
    queryBuilder`
    SELECT kaadon_kasittely.kaato_id,
        kaadon_kasittely.kaadon_kasittely_id,
        kaadon_kasittely.kasittelyid,
        kaadon_kasittely.kasittely_maara,
        kasittely.kasittely_teksti
    FROM kaadon_kasittely
	    INNER JOIN kasittely ON kaadon_kasittely.kasittelyid = kasittely.kasittelyid
    WHERE ${"column"} = ${"value"};`
);

// View for group shares in the mobile app
viewMap.set(
    "mobiili_ryhmien_jaot",
    queryBuilder`
    SELECT kaadon_kasittely.kaato_id,
        kaadon_kasittely.kasittely_maara,
        sum(ruhonosa.osnimitys_suhdeluku) * 10000::double precision / kaadon_kasittely.kasittely_maara::double precision AS jaettu_pros,
        (jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS kaataja,
        kaato.kaatopaiva,
        kaato.paikka_teksti,
        kaato.elaimen_nimi,
        kaato.ikaluokka,
        kaato.sukupuoli,
        kasittely.kasittely_teksti,
        kaato.ruhopaino,
        kaadon_kasittely.kaadon_kasittely_id
    FROM jasen
        JOIN kaato ON jasen.jasen_id = kaato.jasen_id
        JOIN kaadon_kasittely ON kaadon_kasittely.kaato_id = kaato.kaato_id
        JOIN kasittely ON kaadon_kasittely.kasittelyid = kasittely.kasittelyid
        LEFT JOIN jakotapahtuma ON jakotapahtuma.kaadon_kasittely_id = kaadon_kasittely.kaadon_kasittely_id
        LEFT JOIN ruhonosa ON ruhonosa.osnimitys::text = jakotapahtuma.osnimitys::text
    WHERE ${"column"} = ${"value"}
    GROUP BY kaadon_kasittely.kaato_id, kaadon_kasittely.kasittely_maara, ((jasen.sukunimi::text || ' '::text) || jasen.etunimi::text), kaato.kaatopaiva, kaato.paikka_teksti, kaato.elaimen_nimi, kaato.ikaluokka, kaato.sukupuoli, kasittely.kasittely_teksti, kaato.ruhopaino, kaadon_kasittely.kaadon_kasittely_id
    ORDER BY kaadon_kasittely.kaato_id DESC;`
);

viewMap.set(
    "mobiili_jasenyydet",
    queryBuilder`
    SELECT jasenyys.jasen_id,
	jasenyys.jasenyys_id,
	(jasen.sukunimi::text || ' '::text) || jasen.etunimi::text AS jasenen_nimi,
	jasenyys.osuus,
	jasenyys.liittyi,
	jasenyys.poistui,
	jasenyys.ryhma_id,
    jasenyys.seurue_id
FROM jasenyys
	INNER JOIN jasen ON jasen.jasen_id = jasenyys.jasen_id
	INNER JOIN jakoryhma ON jakoryhma.ryhma_id = jasenyys.ryhma_id
WHERE ${"column"} = ${"value"};`
);
