import Joi from "joi";

export default {
    createNew: {
        body: Joi.array().items(
            Joi.object().keys({
                barcode: Joi.string().required(),
                delivery_point_for_unloading: Joi.number().required(),
                volumetric_weight: Joi.number()
            })
        )
    },
    loadInto: {
        body: Joi.array().items(
            Joi.string().required(),
        )
    },
    distribution: {
        body: Joi.object().keys({
            plate: Joi.string().required(),
            route: Joi.array().items(
                Joi.object().keys(
                    {
                        deliveryPoint: Joi.number().required(),
                        deliveries: Joi.array().items(
                            Joi.object().keys({
                                barcode: Joi.string().required()
                            })
                        ).required()
                    }
                )
            ).required()
        })
    }
}