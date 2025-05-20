import { getCityById } from './cityService.js'
import { getWeatherByCityName } from './weatherService.js'

export const getCityInfo = async (request, reply) => {
  const cityId = request.params.cityId

  try {
    const city = await getCityById(cityId)
    const { name, latitude, longitude, population, knownFor, recipes } = city

    const weather = await getWeatherByCityName(name)
    const forecast = weather.forecast

    const result = {
      coordinates: [latitude, longitude],
      population,
      knownFor,
      weatherPredictions: [
        { when: 'today', min: forecast[0].min, max: forecast[0].max },
        { when: 'tomorrow', min: forecast[1].min, max: forecast[1].max }
      ],
      recipes: recipes || []
    }

    reply.send(result)
  } catch (error) {
    reply.status(404).send({ error: error.message })
  }
}
