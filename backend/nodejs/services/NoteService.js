import axios from "axios";
import Note from "../models/Note.js";

export default class NoteService {
    constructor(database) {
        this.token = "0046013d69a1e2ac718b1ac01d69bd041c1168a36b822dac6a08d41db3003b18";
        this.dbContext = database;
    }

    async generateNote(padName) {
        try {
            await axios.post(
                "http://localhost:9001/api/1.3.0/createPad",
                { 
                    padID: padName
                },
                { 
                    headers: 
                    { 
                        "Authorization": this.token 
                    } 
                }
            );
            return padName;
        } catch (error) {
            console.error(error);
            return "";
        }
    }

    async listNotes() {
        try {
            const result = await this.dbContext.query("SELECT * FROM Notes", []);
            
            // Ensure result is an array and return empty if not
            const notes = result && Array.isArray(result) ? result : [];
    
            // Map each row to a Note, converting the keys to lowercase
            return notes.map(row => {
                // Convert all keys to lowercase
                const formattedRow = Object.fromEntries(
                    Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])
                );
                return new Note(formattedRow); // Create a new Note object
            });
        } catch (error) {
            console.error('Error querying Notes table:', error);
            return []; // Return an empty array if there's an error
        }
    }       

    async getNote(padID) {
        try {
            const result = await this.dbContext.query("SELECT * FROM Notes WHERE Id = ?", [padID]);
            return result.rows.length > 0 ? new Note(result.rows[0]) : null; // Convert row to Note object
        } catch (error) {
            console.error("Error querying Notes table:", error);
            return null; // Return null on error
        }
    }
}
