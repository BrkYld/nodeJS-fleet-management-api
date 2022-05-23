import Joi from "joi";

export default {
    createNew: {
        body: Joi.object().keys({
            licence_plate: Joi.string().required(),
        }),
    }
}