export type ServerErrorType = {
    success: boolean;
    errorType: string;
    errorMessage: string;
    errorDetails: string[];
};

export class ServerError extends Error {
    errorType: string;
    errorDetails: string[];

    constructor(error: ServerErrorType) {
        super(error.errorMessage);
        this.errorType = error.errorType ?? ""; // Use the nullish coalescing operator to provide a default value
        this.errorDetails = error.errorDetails ?? [];
    }
}
