import { getRiskDataByLngLat } from '../../services/data'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const lat = url.searchParams.get('lat')
  const lng = url.searchParams.get('lng')
  const data = getRiskDataByLngLat(Number(lng), Number(lat))
  return new Response(JSON.stringify(data))
}
