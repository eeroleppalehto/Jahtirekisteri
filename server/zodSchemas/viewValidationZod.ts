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
    const viewMap = new Map<string, string>(
        [
            ["home", "home"],
            ["about", "about"],
            ["contact", "contact"],
            ["login", "login"],
            ["register", "register"],
            ["profile", "profile"],
            ["dashboard", "dashboard"],
            ["admin", "admin"],
            ["user_table", "user_table"],
            ["404", "404"],
            ["500", "500"],
        ]
    );

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
