type Params = {
    column: string | number;
    value: number;
};

/**This function allows us to use template literals to construct queries
 *
 * Example:
 * const queryBuilder = queryBuilder`SELECT * FROM jasen WHERE ${"id"} = ${"value"}`;
 *
 * The function takes a template literal and returns a function that takes
 * an object with two properties: column and value.
 *
 * @param strings
 * @param _keys
 * @returns
 */
export function queryBuilder(
    strings: TemplateStringsArray,
    ..._keys: string[]
) {
    return ({ column, value }: Params) => {
        return strings[0] + column + strings[1] + value + strings[2];
    };
}
