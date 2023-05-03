import Papa from "papaparse";
import fs from "fs";
import path from 'path'
import { isEmpty } from "lodash";

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
  
  let parsedData = []
  if (!isEmpty(data)) {
    return
  } else {
    parsedData = await readCSV(FILE_PATH)
    parsedData = parsedData.map((obj) => ({
    ...obj,
    Year: Number(obj.Year),
    Lat: Number(obj.Lat),
    Long: Number(obj.Long),
    'Risk Rating': Number(obj['Risk Rating']),
    }))
  }

  data = parsedData
  minYear = Math.min(...data.map((obj) => obj.Year))
  maxYear = Math.max(...data.map((obj) => obj.Year))
}

export const getMinYear = () => minYear

export const getMaxYear = () => maxYear

export const getRiskDataByDecade = (decade) => (data.filter((obj) => obj.Year >= decade && obj.Year <= decade + 9))

export const getRiskDataByLngLat = (lng, lat) => (data.filter((obj) => Number(obj.Long) === Number(lng) && Number(obj.Lat) === Number(lat)))