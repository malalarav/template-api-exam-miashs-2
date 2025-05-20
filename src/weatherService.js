const BASE_URL = 'https://api-ugi2pflmha-ew.a.run.app'

export async function getWeatherByCityName(cityName) {
  const res = await fetch(`${BASE_URL}/weather?city=${encodeURIComponent(cityName)}`)

  if (!res.ok) {
    throw new Error(`Météo non trouvée pour ${cityName}`)
  }

  return await res.json()
}
