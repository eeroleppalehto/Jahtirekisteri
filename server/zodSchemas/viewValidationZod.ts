// Import necessary zod library
import { z } from "zod";

/**
 * Validates if the provided view name exists in the predefined viewMap.
 *
 * @param {string} view - The name of the view to be validated.
 * @returns {boolean} - Returns true if the view exists in the map, otherwise returns false.
 */
const validateView = (view: string) => {
    // Predefined map of valid view names
    const viewMap = new Map<string, string>([
        ["jaetut_lihat", "jaetut_lihat"],
        ["jaetut_ruhon_osat", "jaetut_ruhon_osat"],
        ["jaetut_ruhon_osat_jasenille", "jaetut_ruhon_osat_jasenille"],
        ["jako_kaadot", "jako_kaadot"],
        ["jako_kaadot_jasenille", "jako_kaadot_jasenille"],
        ["jakoryhma_osuus_maara", "jakoryhma_osuus_maara"],
        ["jakoryhma_seurueen_nimella", "jakoryhma_seurueen_nimella"],
        ["jakoryhma_yhteenveto", "jakoryhma_yhteenveto"],
        [
            "jakotapahtuma_jasen_jasen_nimella",
            "jakotapahtuma_jasen_jasen_nimella",
        ],
        ["jakotapahtuma_ryhman_nimella", "jakotapahtuma_ryhman_nimella"],
        ["jasen_tila", "jasen_tila"],
        ["jasenyys_nimella", "jasenyys_nimella"],
        ["jasenyys_nimella_ryhmalla", "jasenyys_nimella_ryhmalla"],
        ["kaatoluettelo", "kaatoluettelo"],
        ["kaatoluettelo_indeksilla", "kaatoluettelo_indeksilla"],
        ["lihan_kaytto", "lihan_kaytto"],
        ["luvat_kayttamatta_kpl_pros", "luvat_kayttamatta_kpl_pros"],
        ["nimivalinta", "nimivalinta"],
        ["ryhmat_jasenilla", "ryhmat_jasenilla"],
        ["ryhmien_osuudet", "ryhmien_osuudet"],
        ["sankey_elain_kasittely_seurue", "sankey_elain_kasittely_seurue"],
        ["sankey_jasen_jako_kg", "sankey_jasen_jako_kg"],
        ["sankey_jasen_jako_kpl", "sankey_jasen_jako_kpl"],
        ["seurue_lihat", "seurue_lihat"],
        ["seurue_lihat_osuus", "seurue_lihat_osuus"],
        ["seurue_ryhmilla", "seurue_ryhmilla"],
        ["seurue_sankey", "seurue_sankey"],
    ]);

    // Check if the view exists in the map
    if (viewMap.has(view)) {
        return true;
    } else {
        return false;
    }
};

// Define a zod schema to validate string views based on the validateView function
const viewsZod = z.string().refine(validateView, {
    message: "Invalid view",
});

// Export the schema for use in other modules
export default viewsZod;
