import express from 'express';
import { validate } from 'express-validation';
import deliveryPointController from '../controller/deliveryPoint.js';
import { deliveryPointValidation } from '../validation/index.js';

const router = express.Router();

router
    .route('/')
    .get(deliveryPointController.getDeliveryPoints)
    .post(validate(deliveryPointValidation.createNew), deliveryPointController.createDeliveryPoint)
    

export default router;
