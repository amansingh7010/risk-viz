"use client"; // this is a client component

import { useState, useMemo } from "react";

import RiskMap from "./RiskMap";
import Table from "./Table";

const RiskThinking = ({ data, minYear, maxYear }) => {
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
      <li
        key={num}
        className={`py-2 hover:bg-gray-800 rounded m-1 p-2 ${
          decade === num && "bg-gray-700"
        }`}
      >
        <button onClick={() => setDecade(num)}>
          <span className="hidden sm:inline">
            {num} - {num + 9}
          </span>
        </button>
      </li>
    ));
  };

  // console.log(filteredData)
  return (
    <div className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-4 flex-grow">
      <div className="w-fixed w-full flex-shrink flex-grow-0 px-4 ">
        <div className="sticky top-0 p-4 rounded-xl w-full h-full">
          <h2 className="font-bold tracking-tight text-gray-900 sm:text-2xl">
            <span className="block text-gray-300">Decade</span>
          </h2>
          <ul className="flex sm:flex-col overflow-hidden content-center justify-center">
            {renderDecades()}
          </ul>
        </div>
      </div>
      <div className="w-full flex-grow pt-1 px-3 map-container">
        <RiskMap data={filteredData} />
      </div>
      {filteredData && (
        <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
          <div className="flex sm:flex-col px-2">
            <Table data={filteredData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskThinking;
