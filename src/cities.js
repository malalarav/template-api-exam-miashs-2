import { getCityById } from './cityService.js'
import { getWeatherByCityName } from './weatherService.js'

export const getCityInfo = async (request, reply) => {
  const { cityId } = request.params

  try {
    const city = await getCityById(cityId)

    if (!city || !city.name || !city.latitude || !city.longitude) {
      return reply.status(404).send({ error: `Ville introuvable avec l'ID ${cityId}` })
    }

    const {
      latitude,
      longitude,
      population,
      knownFor,
      recipes = [],
      name
    } = city

    const weather = await getWeatherByCityName(name)

    const forecast = Array.isArray(weather.forecast) ? weather.forecast.slice(0, 2) : []

    if (forecast.length < 2) {
      return reply.status(500).send({ error: "Pas assez de données météo." })
    }

    const response = {
      coordinates: [latitude, longitude],
      population,
      knownFor,
      weatherPredictions: [
        {
          when: "today",
          min: forecast[0].min,
          max: forecast[0].max
        },
        {
          when: "tomorrow",
          min: forecast[1].min,
          max: forecast[1].max
        }
      ],
      recipes: recipes.map(r => ({
        id: r.id,
        content: r.content
      }))
    }

    return reply.send(response)

  } catch (err) {
    return reply.status(404).send({ error: `Ville introuvable avec l'ID ${cityId}` })
  }
}
