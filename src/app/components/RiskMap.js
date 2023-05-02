"use client";

import { useState, useCallback, useMemo } from "react";
import Map, {
  Layer,
  Source,
  Popup,
  ScaleControl,
  NavigationControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import RiskChart from "./RiskChart";

const RiskMap = ({ data }) => {
  const [hoverInfo, setHoverInfo] = useState(null);
  const [graphInfo, setGraphInfo] = useState(null);

  const geoJson = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: data.map((obj, key) => {
        let riskRatingColor = "#165c11";
        if (obj["Risk Rating"] > 0.25 && obj["Risk Rating"] <= 0.5) {
          riskRatingColor = "#a69214";
        } else if (obj["Risk Rating"] > 0.5 && obj["Risk Rating"] <= 0.75) {
          riskRatingColor = "#a65f14";
        } else {
          riskRatingColor = "#a61414";
        }

        return {
          id: `feature-${key}`,
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [obj.Long, obj.Lat],
          },
          properties: {
            riskRating: obj["Risk Rating"],
            riskRatingColor,
            assetName: obj["Asset Name"],
            businessCategory: obj["Business Category"],
            latitude: obj.Lat,
            longitude: obj.Long,
            year: obj.Year,
            riskFactors: obj["Risk Factors"],
          },
        };
      }),
    };
  }, [data]);

  const onHover = useCallback((event) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];
    setHoverInfo(hoveredFeature && { feature: hoveredFeature, x, y });
  }, []);

  const onClick = useCallback((event) => {
    console.log(event)
    const {
      lngLat,
    } = event;
    setGraphInfo(lngLat);
  }, []);

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 7,
      "circle-color": ["get", "riskRatingColor"],
      "circle-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0.4,
      ],
    },
  };

  return (
    <div className="flex">
      <div className="m-2">
        <Map
          initialViewState={{
            longitude: -93,
            latitude: 40,
            zoom: 3,
            pitch: 25,
          }}
          style={{ width: 800, height: 600, borderRadius: 10 }}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          onMouseMove={onHover}
          onClick={onClick}
          interactiveLayerIds={["point"]}
        >
          <NavigationControl position="top-left" />
          <ScaleControl />

          <Source id="riskData" type="geojson" data={geoJson}>
            <Layer {...layerStyle} />
          </Source>

          {hoverInfo && (
            <Popup
              anchor="top"
              longitude={hoverInfo.feature.properties.longitude}
              latitude={hoverInfo.feature.properties.latitude}
              onClose={() => setHoverInfo(null)}
              closeButton={false}
            >
              <div className="text-white bg-inherit">
                <div>Asset Name: {hoverInfo.feature.properties.assetName}</div>
                <div>
                  Business Category:{" "}
                  {hoverInfo.feature.properties.businessCategory}
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
      <div className="w-full m-auto">
        <RiskChart lngLat={graphInfo} />
      </div>
    </div>
  );
};

export default RiskMap;
