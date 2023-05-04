import { getMapData } from '../../services/data'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const decade = url.searchParams.get('decade')
  const name = url.searchParams.get('name')
  const category = url.searchParams.get('category')
  const data = await getMapData(Number(decade), name, category)
  return new Response(JSON.stringify(data))
}
