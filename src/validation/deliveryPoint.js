import Joi from "joi";

export default {
    createNew: {
        body: Joi.object().keys({
            name: Joi.string().required(),
            allow_to_unload: Joi.array().items(
                Joi.string().required()
            ).required()
        }),
    }
}