import fetch from 'node-fetch'

const BASE_URL = 'https://api-ugi2pflmha-ew.a.run.app'

export async function getCityById(cityId) {
  const res = await fetch(`${BASE_URL}/cities/${cityId}`)

  if (!res.ok) {
    throw new Error(`Ville introuvable avec l'ID ${cityId}`)
  }

  return await res.json()
}
