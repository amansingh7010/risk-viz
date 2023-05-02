"use client";

import { useEffect, useState, useMemo } from "react"
import axios from "axios"

import RiskMap from "./RiskMap"

const RiskApp = ({ minYear, maxYear }) => {
  const [loading, setLoading] = useState(false)
  const [decade, setDecade] = useState(minYear);
  const [filteredData, setFilteredData] = useState([])

  const startDecade = Math.floor(minYear / 10) * 10;
  const endDecade = Math.ceil(maxYear / 10) * 10;

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/map?decade=${decade}`)
      .then((res) => {
        setFilteredData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [decade])

  const renderDecades = () => {
    let currentDecade = startDecade;
    const decadeList = [];
    while (currentDecade <= endDecade) {
      decadeList.push(currentDecade);
      currentDecade += 10;
    }
    return decadeList.map((num) => (
      <option key={num} value={num}>{num} - {num + 9}</option>
    ));
  };


  const loadingJsx = (
    <div className="flex justify-center align-center">
      <div className="w-full text-3xl">Loading...</div>
    </div>
  )

  return (
    <div className="flex flex-col w-full">
      <div className="w-1/4">
        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a decade</label>
        <select onChange={(e) => {setDecade(Number(e.target.value))}} id="countries" className="w-1/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          {renderDecades()}
        </select>
    </div>
    <div className="py-4">
      <RiskMap data={filteredData} />
    </div>
  </div>
  );
};

export default RiskApp;
