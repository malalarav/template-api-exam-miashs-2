const BASE_URL = 'https://api-ugi2pflmha-ew.a.run.app'

export async function getCityById(cityId) {
  const res = await fetch(`${BASE_URL}/cities/${encodeURIComponent(cityId)}`)

  if (!res.ok) {
    throw new Error(`City not found`)
  }

  return await res.json()
}
