// Import necessary zod library
import { z } from "zod";
import { viewMap } from "../utils/viewMap";

/**
 * Validates if the provided view name exists in the predefined viewMap.
 *
 * @param {string} view - The name of the view to be validated.
 * @returns {boolean} - Returns true if the view exists in the map, otherwise returns false.
 */
const validateView = (view: string) => {
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
