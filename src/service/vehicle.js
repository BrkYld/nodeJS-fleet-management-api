import { vehicleRepository } from "../repository/index.js";

export default {
    createVehicle: async newVehicle => {
        return await vehicleRepository.create(newVehicle);
    },
}