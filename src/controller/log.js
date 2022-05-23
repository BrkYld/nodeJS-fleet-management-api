import httpStatus from "http-status"
import { logService } from "../service/index.js";
import ApiResponse from "../utils/ApiResponse.js";

const createReport = async (req, res, next) => {
    try {
        const logs = await logService.createReport();
        res.send(logs)
    } catch (error) {
        next(error)
    }
}

export default { createReport };