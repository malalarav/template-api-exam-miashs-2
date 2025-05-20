import { getCityById } from './cityService.js'
import { getWeatherByCityName } from './weatherService.js'

// Pour simuler une base temporaire
const memory = {}

export const getCityInfo = async (request, reply) => {
  const { cityId } = request.params

  try {
    const city = await getCityById(cityId)
    const weather = await getWeatherByCityName(city.name)

    const localRecipes = memory[cityId] || []

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
      recipes: [...(city.recipes || []), ...localRecipes]
    }

    return reply.send(response)

  } catch (err) {
    return reply.status(404).send({ error: `Ville introuvable avec l'ID ${cityId}` })
  }
}

export const addRecipe = async (request, reply) => {
  const { cityId } = request.params
  const { content } = request.body

  if (!content || content.length < 3 || content.length > 500) {
    return reply.status(400).send({ error: "Recipe content must be between 3 and 500 characters" })
  }

  try {
    await getCityById(cityId) // vérifie si la ville existe

    const recipe = {
      id: `${Date.now()}`,
      content
    }

    if (!Array.isArray(memory[cityId])) {
      memory[cityId] = []
    }

    memory[cityId].push(recipe)

    return reply.status(201).send(recipe)

  } catch (err) {
    return reply.status(404).send({ error: "City not found" })
  }
}

export const deleteRecipe = async (request, reply) => {
  const { cityId, recipeId } = request.params

  try {
    await getCityById(cityId) // Vérifie si la ville existe

    const cityRecipes = memory[cityId]
    if (!Array.isArray(cityRecipes)) {
      return reply.status(404).send()
    }

    const index = cityRecipes.findIndex(r => r.id === recipeId)
    if (index === -1) {
      return reply.status(404).send()
    }

    cityRecipes.splice(index, 1)
    return reply.status(204).send()

  } catch (err) {
    return reply.status(404).send()
  }
}
