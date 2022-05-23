import express from 'express';
import { validate } from 'express-validation';
import vehicleController from '../controller/vehicle.js';
import { vehicleValidation } from '../validation/index.js';

const router = express.Router();

router
    .route('/')
    .post(validate(vehicleValidation.createNew), vehicleController.createVehicle)

export default router;