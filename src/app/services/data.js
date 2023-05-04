import Papa from "papaparse";
import fs from "fs";
import path from 'path'
import { isEmpty, groupBy } from "lodash";

const FILE_PATH = `${path.join(process.cwd(), 'data')}/dataset.csv`

let data = [];
let minYear = -1;
let maxYear = -1;

const readCSV = (filePath) => {

  const csvFile = fs.readFileSync(filePath);
  const csvData = csvFile.toString();

  return new Promise((resolve) => {
    Papa.parse(csvData, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};

export const loadData = async () => {
  console.log('loading data...')
  let parsedData = []
  if (!isEmpty(data)) {
    return data
  } else {
    parsedData = await readCSV(FILE_PATH)
    console.log('data loaded')
    data = parsedData.map((obj) => ({
    ...obj,
    Year: Number(obj.Year),
    Lat: Number(obj.Lat),
    Long: Number(obj.Long),
    'Risk Rating': Number(obj['Risk Rating']),
    }))

    minYear = Math.min(...data.map((obj) => obj.Year))
    maxYear = Math.max(...data.map((obj) => obj.Year))
  }

  return data
}

export const getMinYear = () => minYear
export const getMaxYear = () => maxYear

export const getRiskDataByDecade = async (decade) => {
  const loadedData = await loadData()
  return loadedData.filter((obj) => obj.Year >= decade && obj.Year <= decade + 9)
}

export const getRiskDataByLngLat = async (lng, lat) => {
  const loadedData = await loadData()
  const filteredData = loadedData.filter((obj) => Number(obj.Long) === Number(lng) && Number(obj.Lat) === Number(lat))
  const groupedData = groupBy(filteredData, 'Year')
  const labels = Object.keys(groupedData)
  const averageRiskRating = labels.map((lab) => groupedData[lab].reduce((total, next) => total + next["Risk Rating"], 0)/groupedData[lab].length)

  const topRiskFactors = {}

  for (const dataKey in groupedData) {
    // create map of all risk factors with highest risk ratings for each year
    const topRiskFactorsMap = new Map()
    
    groupedData[dataKey].forEach((obj) => {
      const riskFactors = JSON.parse(obj["Risk Factors"])

      for(const riskFactorsKey in riskFactors) {
        const riskRating = riskFactors[riskFactorsKey]

        if (!topRiskFactorsMap.has(riskFactorsKey)) {
          topRiskFactorsMap.set(riskFactorsKey, riskRating)
        } else {
          const rating = topRiskFactorsMap.get(riskFactorsKey)

          if (riskRating > rating) {
            topRiskFactorsMap.set(riskFactorsKey, riskRating)
          }
        }
      }

      // convert map to object
      const topRiskFactorsObj = Object.fromEntries(topRiskFactorsMap)

      // convert object to array
      const topRiskFactorsArr = []
      for (const key in topRiskFactorsObj){
        topRiskFactorsArr.push( {[key]: topRiskFactorsObj[key]} )
      }

      // sort the array
      const sortedTopRiskFactorsArr = topRiskFactorsArr.sort( (a,b) => { 
        if (Object.values(a)[0] > Object.values(b)[0]) {
          return -1
        } 
      })

      // extract top three values
      const topThreeRiskFactors = sortedTopRiskFactorsArr.slice(0,3)

      topRiskFactors[dataKey] = Object.assign({}, ...topThreeRiskFactors)
    })
  }

  return { labels, averageRiskRating, topRiskFactors }
}