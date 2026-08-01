import { Router } from "express";
import { createContactMessage, getContactMessages } from "../controllers/contact.controller";

const router = Router();

router.post("/", createContactMessage);
router.get("/", getContactMessages);

export default router;