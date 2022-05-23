import express from 'express';
import logController from '../controller/log.js';

const router = express.Router();

router
    .route('/')
    .get(logController.createReport)

export default router;
