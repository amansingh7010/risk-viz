import { getChartData } from '../../services/data'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const lat = url.searchParams.get('lat')
  const lng = url.searchParams.get('lng')
  const name = url.searchParams.get('name')
  const category = url.searchParams.get('category')
  const data = await getChartData(Number(lng), Number(lat), name, category)
  return new Response(JSON.stringify(data))
}
