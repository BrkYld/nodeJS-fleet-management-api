import httpStatus from "http-status"
import { deliveryPointService } from "../service/index.js";
import ApiResponse from "../utils/ApiResponse.js";


const createDeliveryPoint = async (req, res, next) => {
    try {
        const deliveryPoint = await deliveryPointService.createDeliveryPoint(req.body);
        res.status(httpStatus.CREATED).send(new ApiResponse(deliveryPoint));
    } catch (error) {
        next(error);
    }
}

const getDeliveryPoints = async (req, res, next) => {
    try {
        const deliveryPointList = await deliveryPointService.getDeliveryPoints();
        res.send(new ApiResponse(deliveryPointList))
    } catch (error) {
        next(error)
    }
}


export default { createDeliveryPoint, getDeliveryPoints };