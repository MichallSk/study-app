import axios from "axios";
import Note from '../models/Note.js';
import NoteService from "../services/NoteService.js";

export default class NotesController {
    constructor(appData) {
        this.appData = appData;
        this.noteService = new NoteService(appData.db);
        this.token = "0046013d69a1e2ac718b1ac01d69bd041c1168a36b822dac6a08d41db3003b18";
    }

    async index(req, res) {
        res.render("index.ejs", { ...this.appData, user: req.session.user });
    }

    async listNotes(req, res) {
        try {
            const notes = await this.noteService.listNotes(); // Fetch notes
            res.renderPartial("partials/list", { ...this.appData, notes }); // Render the list view
        } catch (error) {
            console.error("Error fetching notes:", error);
            res.status(500).send("Error loading notes.");
        }
    }

    async getToken() {
        try {
            const response = await axios.post('http://localhost:9001/oidc/token', new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: 'client_credentials',
                client_secret: 'client_credentials'
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            return response.data.access_token;
        } catch (error) {
            console.error('Error obtaining token:', error.response ? error.response.data : error.message);
        }
    }
    
    async newNote(req, res) {
        let note = new Note();
        let padID = this.getRndInteger(100, 10000000000).toString()
        res.renderPartial("partials/newNote", { ...this.appData, padID});
    }

    async getExistingNote(req, res) {
        const { id } = req.query; // Get the note id from the query parameter
        try {
            // Fetch the note from the database
            const note = await this.noteService.getNote(id);
            if (note) {
                const padID = note.id.toString(); // Use note.id as pad identifier (or another property if needed)
                const etherpadAPIKey = this.token; // Ensure you have your API key set
                // Encode the note content for the URL
                const text = encodeURIComponent(note.content);
                // Construct the Etherpad API URL to set the pad text
                const etherpadURL = `http://localhost:9001/api/1/setText?apikey=${etherpadAPIKey}&padID=${padID}&text=${text}`;
                
                // Call the Etherpad API to update the pad content.
                // Depending on your Etherpad configuration, you might need to use axios.post instead.
                await axios.get(etherpadURL);
                
                // Render the partial that contains the iframe.
                res.renderPartial("partials/existingNote", { ...this.appData, padID });
            } else {
                res.status(404).send("Note not found.");
            }
        } catch (error) {
            console.error('Error fetching note or updating pad:', error);
            res.status(500).send("Internal server error");
        }
    }

    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
      }

}