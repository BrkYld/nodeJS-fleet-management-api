import { deliveryPointRepository } from "../repository/index.js";

export default {
    getDeliveryPoints: async () => {
        return await deliveryPointRepository.getAll();
    },
    createDeliveryPoint: async newDeliveryPoint =>{
        return await deliveryPointRepository.create(newDeliveryPoint);
    },
}