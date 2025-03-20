import BaseController from "./base/BaseController.js";
import Note from '../models/Note.js';
import NoteService from "../services/NoteService.js";
import SessionService from "../services/SessionService.js";
import Delta from 'quill-delta';
import * as pdfjsLib from "pdfjs-dist";

export default class ResearchController extends BaseController{
    constructor(appData) {
        super(appData);
        this.noteService = new NoteService(appData.db);
        this.sessionService = new SessionService(appData.db);
    }

    async index(req, res) {
        res.render("index.ejs", { ...this.appData, user: req.session.user });
    }

    async renderPDF(req, res) {
        const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // Load first page
      
        const canvas = createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext("2d");
      

        const renderContext = { canvasContext: context, viewport };
        res.renderPartial('partials/research', { ...this.appData, renderContext });
        
    }

}