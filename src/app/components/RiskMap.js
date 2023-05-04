import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { MapPinIcon } from '@heroicons/react/24/solid'

import RiskChart from "./RiskChart";
import {
  lowRiskIcon,
  medRiskIcon,
  highRiskIcon,
  extremeRiskIcon
} from "../../constants/icons";

const RiskMap = ({ data }) => {
  const [chartInfo, setChartInfo] = useState(null);

  useEffect(() => {
    setChartInfo(null);
  }, [data]);

  const renderMarkers = useMemo(
    () =>
      data.map((obj, index) => {
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
            <span><MapPinIcon style={{ height: 24, width: 24, color: '#64b007' }} /></span>
            <span>Low Risk</span>
          </div>
           <div className="flex">
            <span><MapPinIcon style={{ height: 24, width: 24, color: '#ad980a' }} /></span>
            <span>Medium Risk</span>
          </div>
           <div className="flex">
            <span><MapPinIcon style={{ height: 24, width: 24, color: '#bd7b09' }} /></span>
            <span>High Risk</span>
          </div>
           <div className="flex">
            <span><MapPinIcon style={{ height: 24, width: 24, color: '#bd0909' }} /></span>
            <span>Extreme Risk</span>
          </div>
        </div>
      </div>
      <div className="w-full m-auto">
        <RiskChart data={chartInfo} />
      </div>
    </div>
  );
};

export default RiskMap;
