import { useState, useMemo, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { MapPinIcon } from "@heroicons/react/24/solid";
import axios from "axios";

import RiskChart from "./RiskChart";
import {
  lowRiskIcon,
  medRiskIcon,
  highRiskIcon,
  extremeRiskIcon,
} from "../../constants/icons";

const RiskMap = ({ decade }) => {
  const [chartInfo, setChartInfo] = useState(null);
  const [data, setData] = useState({
    data: [],
    assetNames: [],
    categories: [],
  });
  const [assetName, setAssetName] = useState("All");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    axios
      .get(`/api/map?decade=${decade}&name=${assetName}&category=${category}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [decade, assetName, category]);

  useEffect(() => {
    setChartInfo(null);
  }, [decade, assetName, category]);

  const renderAssetNames = useCallback(() => {
    const names = data.assetNames.map((name) => (
      <option key={name} value={name}>
        {name}
      </option>
    ));
    names.unshift(
      <option key="All" value="All">
        All Assets
      </option>
    );
    return names;
  }, [data]);

  const renderCategories = useCallback(() => {
    const names = data.categories.map((name) => (
      <option key={name} value={name}>
        {name}
      </option>
    ));
    names.unshift(
      <option key="All" value="All">
        All Categories
      </option>
    );
    return names;
  }, [data]);

  const renderMarkers = useMemo(
    () =>
      data.data.map((obj, index) => {
        let markerIcon = lowRiskIcon;

        if (obj["Risk Rating"] > 0.25 && obj["Risk Rating"] <= 0.5) {
          markerIcon = medRiskIcon;
        } else if (obj["Risk Rating"] > 0.5 && obj["Risk Rating"] <= 0.75) {
          markerIcon = highRiskIcon;
        } else {
          markerIcon = extremeRiskIcon;
        }

        return (
          <Marker
            key={index}
            position={[obj.Lat, obj.Long]}
            icon={markerIcon}
            eventHandlers={{ click: () => setChartInfo(obj) }}
          >
            <Tooltip>
              <p>
                <span>Asset Name: </span>
                <span>{obj["Asset Name"]}</span>
              </p>
              <p>
                <span>Business Category: </span>
                <span>{obj["Business Category"]}</span>
              </p>
            </Tooltip>
          </Marker>
        );
      }),
    [data]
  );

  return (
    <div className="flex">
      <div className="m-2 w-full">
        <div className="flex mb-5 justify-start">
          <div className="flex w-1/3 items-center mx-2">
            <label
              htmlFor="asset-name"
              className="w-1/4 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              <div>
                <span>Name</span>
              </div>
            </label>
            <select
              onChange={(e) => {
                setAssetName(e.target.value);
              }}
              id="asset-name"
              className="bg-gray-50 border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            >
              {renderAssetNames()}
            </select>
          </div>
          <div className="flex w-1/3 items-center mx-2">
            <label
              htmlFor="asset-name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              <div>
                <span>Category</span>
              </div>
            </label>
            <select
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              id="asset-name"
              className="mx-4 bg-gray-50 border text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            >
              {renderCategories()}
            </select>
          </div>
        </div>
        <MapContainer
          center={[50, -93]}
          zoom={3.5}
          scrollWheelZoom={false}
          style={{ width: 800, height: 600, borderRadius: 10 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {renderMarkers}
        </MapContainer>
        <div className="flex w-3/4 m-4 justify-evenly">
          <div className="flex">
            <span>
              <MapPinIcon style={{ height: 24, width: 24, color: "#64b007" }} />
            </span>
            <span>Low Risk</span>
          </div>
          <div className="flex">
            <span>
              <MapPinIcon style={{ height: 24, width: 24, color: "#ad980a" }} />
            </span>
            <span>Medium Risk</span>
          </div>
          <div className="flex">
            <span>
              <MapPinIcon style={{ height: 24, width: 24, color: "#bd7b09" }} />
            </span>
            <span>High Risk</span>
          </div>
          <div className="flex">
            <span>
              <MapPinIcon style={{ height: 24, width: 24, color: "#bd0909" }} />
            </span>
            <span>Extreme Risk</span>
          </div>
        </div>
      </div>
      <div className="w-full m-auto">
        <RiskChart data={chartInfo} name={assetName} category={category} />
      </div>
    </div>
  );
};

export default RiskMap;
