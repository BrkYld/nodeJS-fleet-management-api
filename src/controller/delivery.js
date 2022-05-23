import httpStatus from "http-status"
import { deliveryService } from "../service/index.js";
import ApiResponse from "../utils/ApiResponse.js";


const createPacket = async (req, res, next) => {
    try {
        const packet = await deliveryService.createPacket(req.body);
        res.status(httpStatus.CREATED).send(new ApiResponse(packet));
    } catch (error) {
        next(error);
    }
}
const createBag = async (req, res, next) => {
    try {
        const bag = await deliveryService.createBag(req.body);
        res.status(httpStatus.CREATED).send(new ApiResponse(bag));
    } catch (error) {
        next(error);
    }
}
const getDeliveries = async (req, res, next) => {
    try {
        const deliveries = await deliveryService.getDeliveries();
        res.send(new ApiResponse(deliveries))
    } catch (error) {
        next(error)
    }
}

const getByType = async (req, res, next) => {
    try {
        const deliveries = await deliveryService.getByType(req.path.replace('/', ''));
        res.send(new ApiResponse(deliveries))
    } catch (error) {
        next(error)
    }
}
const getByStatus = async (req, res, next) => {
    try {
        const deliveries = await deliveryService.getByStatus(req.params.statusCode);
        res.send(new ApiResponse(deliveries))
    } catch (error) {
        next(error)
    }
}
const loadIntoBag = async (req, res, next) => {
    try {
        const { bagBarcode } = req.params;
        const bag = await deliveryService.loadIntoBag(bagBarcode, req.body);
        res.status(httpStatus.OK).send(new ApiResponse(bag));
    } catch (error) {
        next(error);
    }
}

const distributionProcess = async (req, res, next) => {
    try {
        await deliveryService.checkForDistribution(req.body);
        const result = await deliveryService.distributionTransaction(req.body);
        res.status(httpStatus.OK).send(new ApiResponse(result));
    } catch (error) {
        next(error);
    }
}

export default { getByType, getDeliveries, createPacket, createBag, loadIntoBag, distributionProcess, getByStatus };