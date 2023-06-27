import { OpenAPIV3 } from 'swagger-jsdoc';

const options: OpenAPIV3.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Url Shortener',
            version: '1.0.0',
            description: 'Url Shortener API',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./src/Controller/*.ts'],
};


export default options;