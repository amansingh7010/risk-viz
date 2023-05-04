import RiskApp from './components/RiskApp'
import { loadData, getMaxYear, getMinYear } from './services/data'
import { ShieldExclamationIcon } from '@heroicons/react/24/solid'

export default async function Home() {

 await loadData()
 
 return (
    <main className="flex min-h-screen flex-col items-center justify-start p-20">
      <header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex">
            <ShieldExclamationIcon className="w-9 mr-4" />
            <h1 className="text-3xl font-bold tracking-tight text-white">RiskThinking UI/UX Work Sample</h1>
          </div>
        </div>
      </header>
      <div className="z-10 w-full max-w-12xl items-center justify-between lg:flex">
        <RiskApp minYear={getMinYear()} maxYear={getMaxYear()} />
      </div>
    </main>
  )
}