import { Router } from 'express';
import { subscribeNewsletter } from '../controllers/newsletterController';

const router = Router();

// To'g'ri ko'rinishi:
router.post('/', subscribeNewsletter); 

export default router;