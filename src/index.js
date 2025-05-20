import 'dotenv/config'
import Fastify from 'fastify'
import { submitForReview } from './submission.js'
import { cityRoutes } from './cities.js'

const fastify = Fastify({ logger: true })

await fastify.register(cityRoutes)

fastify.listen(
  {
    port: process.env.PORT || 3000,
    host: process.env.RENDER_EXTERNAL_URL ? '0.0.0.0' : process.env.HOST || 'localhost',
  },
  function (err) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    submitForReview(fastify)
  }
)
