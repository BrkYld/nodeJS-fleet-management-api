import httpStatus from "http-status"
import { vehicleService } from "../service/index.js";
import ApiResponse from "../utils/ApiResponse.js";


const createVehicle = async (req, res, next) => {
    try {
        const vehicle = await vehicleService.createVehicle(req.body);
        res.status(httpStatus.CREATED).send(new ApiResponse(vehicle));
    } catch (error) {
        next(error);
    }
}


export default { createVehicle };