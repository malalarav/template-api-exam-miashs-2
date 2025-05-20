import 'dotenv/config'
import Fastify from 'fastify'
import { submitForReview } from './submission.js'
import { getCityInfo, addRecipe, deleteRecipe } from './cities.js'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

const fastify = Fastify({ logger: true })

await fastify.register(swagger, {
  swagger: {
    info: {
      title: 'City API',
      version: '1.0.0',
      description: 'API des villes et recettes pour le test'
    }
  },
  exposeRoute: true,
  routePrefix: '/json' // Swagger JSON sur /json
})

await fastify.register(swaggerUi, {
  routePrefix: '/', // Swagger UI à la racine
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: true,
  transformStaticCSP: (header) => header
})

// Routes API
fastify.get('/cities/:cityId/infos', getCityInfo)
fastify.post('/cities/:cityId/recipes', addRecipe)
fastify.delete('/cities/:cityId/recipes/:recipeId', deleteRecipe)

async function main() {
  fastify.listen(
    {
      port: process.env.PORT || 3000,
      host: process.env.RENDER_EXTERNAL_URL ? '0.0.0.0' : 'localhost',
    },
    function (err) {
      if (err) {
        fastify.log.error(err)
        process.exit(1)
      }

      submitForReview(fastify)
    }
  )
}

main().catch((err) => {
  fastify.log.error(err)
  process.exit(1)
})
