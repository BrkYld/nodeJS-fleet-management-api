import express from 'express';
import { validate } from 'express-validation';
import deliveryController from '../controller/delivery.js';
import { deliveryValidation } from '../validation/index.js';

const router = express.Router();

router
    .route('/')
    .get(deliveryController.getDeliveries)
    .post(validate(deliveryValidation.distribution), deliveryController.distributionProcess)

router
    .route('/status/:statusCode')
    .get(deliveryController.getByStatus)

router
    .route('/packet')
    .post(validate(deliveryValidation.createNew), deliveryController.createPacket)
    .get(deliveryController.getByType)

router
    .route('/bag')
    .post(validate(deliveryValidation.createNew), deliveryController.createBag)
    .get(deliveryController.getByType)

router
    .route('/bag/:bagBarcode')
    .put(validate(deliveryValidation.loadInto), deliveryController.loadIntoBag)

export default router;
