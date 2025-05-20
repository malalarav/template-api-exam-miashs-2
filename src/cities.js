import { getCityById } from './cityService.js'
import { getWeatherByCityName } from './weatherService.js'

export async function cityRoutes(fastify, options) {
  fastify.get('/cities/:cityId/infos', async (request, reply) => {
    const { cityId } = request.params

    try {
      // 1. Infos de la ville
      const city = await getCityById(cityId)
      const { name, latitude, longitude, population, knownFor, recipes } = city

      // 2. Météo
      const weather = await getWeatherByCityName(name)
      const forecast = weather.forecast

      // 3. Réponse formatée
      const response = {
        coordinates: [latitude, longitude],
        population,
        knownFor,
        weatherPredictions: [
          { when: 'today', min: forecast[0].min, max: forecast[0].max },
          { when: 'tomorrow', min: forecast[1].min, max: forecast[1].max },
        ],
        recipes: recipes || [],
      }

      return response
    } catch (err) {
      request.log.error(err)
      reply.status(404).send({ error: err.message })
    }
  })
}
