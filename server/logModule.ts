// logModule.ts

// Importing the file system (fs) module with promises support from Node.js
// This enables asynchronous file operations like reading, writing, etc.
import * as fs from 'fs/promises';

// Defining an asynchronous function 'writeLog' to handle logging
// This function takes a single parameter 'message' of type string
export async function writeLog(message: string): Promise<void> {
    try {
        // Appending the given message to the log file
        // The 'appendFile' method is used to add new content to the end of the file
        // If the file does not exist, it is created
        // The log file path is 'server/logs/server.log'
        // Adding a newline character ('\n') after each message for better readability in the log file
        await fs.appendFile('server/logs/server.log', message + '\n');
    } catch (error) {
        // Catching any errors that occur during the file writing process
        // Logging the error message to the console
        console.error('Error writing to log file:', error);
    }
}