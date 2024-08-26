import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export function setupSwagger(app: Express, url: string) {
  const SWAGGER_OPTIONS = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Digital-Energy-Backend-Dev-Assessment',
        version: '1.0.0',
        description:
          'You are expected to attempt the assessment with your preferred language/framework, push your changes to your git repository, deploy your assessment to any free hosting platform.',
        contact: {
          name: 'Orji Michael',
          email: 'orjimichael4886@gmail.com',
          url: 'https://github.com/mjavason',
        },
      },
      servers: [
        {
          url,
        },
      ],
      // tags: [
      //   {
      //     name: 'Default',
      //     description: 'Default API Operations that come inbuilt',
      //   },
      // ],
    },
    apis: ['**/*.ts'],
  };
  const swaggerSpec = swaggerJSDoc(SWAGGER_OPTIONS);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
