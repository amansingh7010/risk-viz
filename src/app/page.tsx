import RiskApp from './components/RiskApp'
import { loadData, getMaxYear, getMinYear } from './services/data'

let minYear: number = -1
let maxYear: number = -1

const getParsedData = async () => {
  //  await loadData()
   minYear = getMinYear()
   maxYear = getMaxYear()
}

// getParsedData()

export default async function Home() {

 await loadData()
 return (
    <main className="flex min-h-screen flex-col items-center justify-start p-20">
      <header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">RiskThinking UI/UX Work Sample</h1>
        </div>
      </header>
      <div className="z-10 w-full max-w-12xl items-center justify-between lg:flex">
        <RiskApp minYear={getMinYear()} maxYear={getMaxYear()} />
      </div>
    </main>
  )
}