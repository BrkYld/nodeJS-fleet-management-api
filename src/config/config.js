import dotenv from 'dotenv'
import path from 'path'
import Joi from 'joi';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, `../../.env/${process.env.APP_ENV}.env`) })

const envVarsModel = Joi.object().keys({
    APP_ENV: Joi.string().valid('prod', 'dev', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB CONNECTION STRING'),
}).unknown();

const { value: envVars, error } = envVarsModel.validate(process.env)

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export default {
    env : envVars.APP_ENV,
    port : envVars.PORT,
    mongoDB: {
        url : envVars.MONGODB_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
    }
}