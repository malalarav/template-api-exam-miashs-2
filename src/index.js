import 'dotenv/config'
import Fastify from 'fastify'
import { submitForReview } from './submission.js'
import { getCityInfo } from './cities.js'

const fastify = Fastify({ logger: true })

fastify.get('/cities/:cityId/infos', getCityInfo)

async function main() {
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
}

main().catch((err) => {
  fastify.log.error(err)
  process.exit(1)
})
