import { logRepository } from "../repository/index.js";

export default {
    createReport: async () => {
        return await logRepository.getAll();
    },
}