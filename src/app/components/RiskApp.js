"use client"; // this is a client component

import { useState, useMemo } from "react";

import RiskMap from "./RiskMap";
import RiskTable from "./RiskTable";

const RiskApp = ({ data, minYear, maxYear }) => {
  const [decade, setDecade] = useState(minYear);
  const startDecade = Math.floor(minYear / 10) * 10;
  const endDecade = Math.ceil(maxYear / 10) * 10;

  const filteredData = useMemo(
    () => data.filter((obj) => obj.Year >= decade && obj.Year <= decade + 9),
    [data, decade]
  );

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

  // console.log(filteredData)
  return (
    <div className="flex flex-col">
      <div className="w-1/4">
        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a decade</label>
        <select onChange={(e) => {setDecade(Number(e.target.value))}} id="countries" class="w-1/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          {renderDecades()}
        </select>
    </div>

    <div className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow">
      <div className="w-full flex-grow pt-1 px-3 map-container">
        <RiskMap data={filteredData} />
      </div>
      {filteredData && (
        <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
          <div className="flex sm:flex-col px-2">
            <RiskTable data={filteredData} />
          </div>
        </div>
      )}
      </div>
      
    </div>
  );
};

export default RiskApp;
