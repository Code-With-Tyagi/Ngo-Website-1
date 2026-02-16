import express from "express";
import { createContact, getContacts } from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/all", getContacts);
router.post("/", createContact);

export default router;
