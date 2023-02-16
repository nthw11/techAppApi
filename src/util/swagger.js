import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import {
  userSchema,
  techSchema,
  reviewSchema,
  projectSchema,
  companySchema,
} from '../models/swaggerSchemas.js'

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Tech App Api',
      description: 'API for tech app',
      version: '1.0.0',
      contact: {
        name: 'Nathaniel Wallace',
        email: 'nthw.dev@gmail.com',
        url: 'https://nthw.xyz',
      },
    },
    basePath: '/api/',
    servers: [{ url: 'http://localhost:8000' }],
  },
  apis: [
    './src/routes/*.js',
    // './src/routes/tech.js',
    // './src/routes/techLogin.js',
    // './src/routes/user.js',
    // './src/routes/userLogin.js',
    // './src/models/swaggerSchemas.js',
  ],
  components: {
    schemas: [
      userSchema,
      techSchema,
      reviewSchema,
      projectSchema,
      companySchema,
    ],
  },
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app) {
  // swagger page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // docs in json format
  app.get('docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

export default swaggerDocs
