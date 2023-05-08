"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapIcon, TableCellsIcon, CalendarDaysIcon } from '@heroicons/react/20/solid'

const RiskMap = dynamic(() => import("./RiskMap"), { ssr: false });
const RiskTable = dynamic(() => import("./RiskTable"), { ssr: false });

const selectedTabClasses = "bg-gray-800 text-blue-500";
const nonSelectedTabClasses =
  "text-gray-400 hover:bg-gray-800 hover:text-gray-300";

const RiskApp = ({ minYear, maxYear }) => {
  const [decade, setDecade] = useState(minYear);
  const [currentTab, setCurrentTab] = useState("map");

  const startDecade = Math.floor(minYear / 10) * 10;
  const endDecade = Math.ceil(maxYear / 10) * 10;

  const renderDecades = () => {
    let currentDecade = startDecade;
    const decadeList = [];
    while (currentDecade <= endDecade) {
      decadeList.push(currentDecade);
      currentDecade += 10;
    }
    return decadeList.map((num) => (
      <option key={num} value={num}>
        {num} - {num + 9}
      </option>
    ));
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full md:w-1/4 p-2">
        <label
          htmlFor="countries"
          className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
        >
          <div className="flex">
            <CalendarDaysIcon className="mr-3 w-6" />
            <span>Select a decade</span>
          </div>
          
        </label>
        <select
          onChange={(e) => {
            setDecade(Number(e.target.value));
          }}
          id="countries"
          className="w-1/4 bg-gray-50 border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        >
          {renderDecades()}
        </select>
      </div>
      <div className="w-full m-2">
        <ul className="flex flex-wrap border-b border-gray-700">
          <li className="mr-4">
            <button
              className={`inline-block rounded-t-lg py-4 px-4 text-sm font-medium text-center ${
                currentTab === "map"
                  ? selectedTabClasses
                  : nonSelectedTabClasses
              }`}
              onClick={() => setCurrentTab("map")}
            >
              <div className="flex align-center">
                <MapIcon className="w-5" />
                <span className="mx-1.5">Risk Map</span>
              </div>
              
            </button>
          </li>
          <li className="mr-4">
            <button
              className={`inline-block rounded-t-lg py-4 px-4 text-sm font-medium text-center ${
                currentTab === "table"
                  ? selectedTabClasses
                  : nonSelectedTabClasses
              }`}
              onClick={() => setCurrentTab("table")}
            >
              <div className="flex align-center">
                <TableCellsIcon className="w-5" />
                <span className="mx-1.5">Risk Table</span>
              </div>
            </button>
          </li>
        </ul>
      </div>
      <div className="py-4">
        {currentTab === "map" ? (
          <RiskMap decade={decade} />
        ) : (
          <RiskTable decade={decade} />
        )}
      </div>
    </div>
  );
};

export default RiskApp;
