/**
 * Below are sets of rights that are required for each operation.
 */
export const READ_RIGHTS_SET = new Set([
    "pääkäyttäjä",
    "muokkaus",
    "lisäys",
    "luku",
]);
export const WRITE_RIGHTS_SET = new Set(["pääkäyttäjä", "muokkaus", "lisäys"]);
export const EDIT_RIGHTS_SET = new Set(["pääkäyttäjä", "muokkaus"]);
export const DELETE_RIGHTS_SET = new Set(["pääkäyttäjä"]);
