import { getCityById } from './cityService.js'
import { getWeatherByCityName } from './weatherService.js'

let recipesByCity = {} // Stockage en mémoire

export const getCityInfo = async (request, reply) => {
  const { cityId } = request.params

  try {
    const city = await getCityById(cityId)
    const weather = await getWeatherByCityName(city.name)

    const recipes = recipesByCity[cityId] || []

    const response = {
      coordinates: [city.latitude, city.longitude],
      population: city.population,
      knownFor: city.knownFor,
      weatherPredictions: [
        {
          when: 'today',
          min: weather.forecast[0].min,
          max: weather.forecast[0].max
        },
        {
          when: 'tomorrow',
          min: weather.forecast[1].min,
          max: weather.forecast[1].max
        }
      ],
      recipes
    }

    return reply.send(response)

  } catch (err) {
    return reply.status(404).send({ error: `Ville introuvable avec l'ID ${cityId}` })
  }
}

export const addRecipe = async (request, reply) => {
  const { cityId } = request.params
  const { content } = request.body

  if (typeof content !== 'string' || content.trim().length === 0) {
    return reply.status(400).send({ error: 'Contenu requis' })
  }

  if (content.length < 10) {
    return reply.status(400).send({ error: 'Contenu trop court (min 10 caractères)' })
  }

  if (content.length > 2000) {
    return reply.status(400).send({ error: 'Contenu trop long (max 2000 caractères)' })
  }

  try {
    await getCityById(cityId)

    const newRecipe = {
      id: Date.now(), // ou un compteur/uuid
      content
    }

    if (!recipesByCity[cityId]) {
      recipesByCity[cityId] = []
    }

    recipesByCity[cityId].push(newRecipe)

    return reply.status(201).send(newRecipe)

  } catch {
    return reply.status(404).send({ error: `Ville introuvable avec l'ID ${cityId}` })
  }
}

export const deleteRecipe = async (request, reply) => {
  const { cityId, recipeId } = request.params

  try {
    await getCityById(cityId)

    const cityRecipes = recipesByCity[cityId]

    if (!cityRecipes) {
      return reply.status(404).send()
    }

    const index = cityRecipes.findIndex(r => r.id === parseInt(recipeId))

    if (index === -1) {
      return reply.status(404).send()
    }

    cityRecipes.splice(index, 1)
    return reply.status(204).send()

  } catch {
    return reply.status(404).send()
  }
}
