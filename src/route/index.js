import express from 'express';
import config from '../config/config.js';
import vehicreRoute from './vehicleRoute.js'
import deliveryPointRoute from './deliveryPointRoute.js'
import deliveryRoute from './deliveryRoute.js';
import logRoute from './logRoute.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/vehicle',
    route: vehicreRoute,
  },
  {
    path: '/delivery-point',
    route: deliveryPointRoute,
  },
  {
    path: '/delivery',
    route: deliveryRoute,
  },
  {
    path: '/log',
    route: logRoute,
  },
];

// routes available only in development mode
const devRoutes = [
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'dev') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
