import { getRiskDataByDecade } from '../../services/data'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const decade = url.searchParams.get('decade')
  const data = await getRiskDataByDecade(Number(decade))
  return new Response(JSON.stringify(data))
}
