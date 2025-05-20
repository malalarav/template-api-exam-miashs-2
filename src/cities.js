import { getCityById } from './cityService.js'
import { getWeatherByCityName } from './weatherService.js'

const recipesByCity = {}

export const getCityInfo = async (request, reply) => {
  const { cityId } = request.params

  try {
    const city = await getCityById(cityId)
    const weather = await getWeatherByCityName(city.name)

    const localRecipes = recipesByCity[cityId] || []
    const baseRecipes = Array.isArray(city.recipes) ? city.recipes : []

    const response = {
      coordinates: [
        typeof city.latitude === 'number' ? city.latitude : null,
        typeof city.longitude === 'number' ? city.longitude : null
      ],
      population: Number(city.population),
      knownFor: Array.isArray(city.knownFor) ? city.knownFor : [],
      weatherPredictions: [
        {
          when: 'today',
          min: weather.forecast?.[0]?.min ?? null,
          max: weather.forecast?.[0]?.max ?? null
        },
        {
          when: 'tomorrow',
          min: weather.forecast?.[1]?.min ?? null,
          max: weather.forecast?.[1]?.max ?? null
        }
      ],
      recipes: [...baseRecipes, ...localRecipes].map(r => ({
        id: r.id,
        content: r.content
      }))
    }

    return reply.send(response)
  } catch {
    return reply.status(404).send({ error: `Ville introuvable avec l'ID ${cityId}` })
  }
}

export const addRecipe = async (request, reply) => {
  const { cityId } = request.params
  const { content } = request.body

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return reply.status(400).send({ error: 'Content is required and must be a non-empty string' })
  }

  if (content.length < 10) {
    return reply.status(400).send({ error: 'Content too short (min 10 chars)' })
  }

  if (content.length > 2000) {
    return reply.status(400).send({ error: 'Content too long (max 2000 chars)' })
  }

  try {
    const city = await getCityById(cityId)
    if (!city) throw new Error()

    const recipe = {
      id: Date.now(),
      content
    }

    if (!recipesByCity[cityId]) {
      recipesByCity[cityId] = []
    }

    recipesByCity[cityId].push(recipe)

    return reply.status(201).send(recipe)

  } catch {
    return reply.status(404).send({ error: 'City not found' })
  }
}

export const deleteRecipe = async (request, reply) => {
  const { cityId, recipeId } = request.params

  try {
    await getCityById(cityId)

    const cityRecipes = recipesByCity[cityId]
    if (!Array.isArray(cityRecipes)) {
      return reply.status(404).send()
    }

    const index = cityRecipes.findIndex(r => String(r.id) === String(recipeId))
    if (index === -1) {
      return reply.status(404).send()
    }

    cityRecipes.splice(index, 1)
    return reply.status(204).send()
  } catch {
    return reply.status(404).send()
  }
}
