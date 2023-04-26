import Papa from 'papaparse'
import fs from 'fs'
import path from 'path'
import RiskThinking from '../components/Riskthinking'

const FILE_PATH = `${path.join(process.cwd(), 'data')}/dataset.csv`

const readCSV = (filePath :string) => {
  const csvFile = fs.readFileSync(filePath)
  const csvData = csvFile.toString()  
  return new Promise(resolve => {
    Papa.parse(csvData, {
      header: true,
      complete: results => {
        resolve(results.data);
      }
    });
  });
};

let parsedData: any = ''
let minYear: number = -1
let maxYear: number = -1

const getParsedData = async () => {
  parsedData = await readCSV(FILE_PATH)
  minYear = Math.min(...parsedData.map((obj: any) => Number(obj.Year)))
  maxYear = Math.max(...parsedData.map((obj: any) => Number(obj.Year)))
}

getParsedData()

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-20">
      <header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">RiskThinking UI/UX Work Sample</h1>
        </div>
      </header>
      <div className="z-10 w-full max-w-5xl items-center justify-between lg:flex">
        <RiskThinking data={parsedData} minYear={minYear} maxYear={maxYear} />
      </div>
    </main>
  )
}
