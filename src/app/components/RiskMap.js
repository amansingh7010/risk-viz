"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import * as L from "leaflet";

import RiskChart from "./RiskChart";
import {
  LOW_RISK_ICON,
  MED_RISK_ICON,
  HIGH_RISK_ICON,
  EXTREME_RISK_ICON,
} from "../../constants/constants";

const LeafIcon = L.Icon.extend({
  options: {},
});

const lowRiskIcon = new LeafIcon({
  iconUrl: LOW_RISK_ICON,
});

const medRiskIcon = new LeafIcon({
  iconUrl: MED_RISK_ICON,
});

const highRiskIcon = new LeafIcon({
  iconUrl: HIGH_RISK_ICON,
});

const extremeRiskIcon = new LeafIcon({
  iconUrl: EXTREME_RISK_ICON,
});

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
      </div>
      <div className="w-full m-auto">
        <RiskChart data={chartInfo} />
      </div>
    </div>
  );
};

export default RiskMap;
