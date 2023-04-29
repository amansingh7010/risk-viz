"use client"; // this is a client component

import { useEffect, useState, useCallback, useMemo } from 'react'
import Map, { Layer, Source, Popup, ScaleControl, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const RiskThinking = ({ data, minYear, maxYear }) => {
    const [decade, setDecade] = useState(minYear)
    const [hoverInfo, setHoverInfo] = useState(null);
    const startDecade = Math.floor(minYear/10)*10
    const endDecade = Math.ceil(maxYear/10)*10

    const filteredData = useMemo(() => data.filter((obj) => (obj.Year >= decade && obj.Year <= decade+9)), [data, decade])
    const geoJson = useMemo(() => {
        return {
            type: 'FeatureCollection',
            features: filteredData.map((obj, key) => {
                let riskRatingColor = '#165c11'
                if (obj['Risk Rating'] > 0.25 && obj['Risk Rating'] <= 0.5) {
                    riskRatingColor = '#a69214'
                } else if (obj['Risk Rating'] > 0.5 && obj['Risk Rating'] <= 0.75) {
                    riskRatingColor = '#a65f14'
                } else {
                    riskRatingColor = '#a61414'
                }

                return (
                    {
                        id: `feature-${key}`,
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [obj.Long, obj.Lat]
                        },
                        properties: {
                            riskRating: obj['Risk Rating'],
                            riskRatingColor,
                            assetName: obj['Asset Name'],
                            businessCategory: obj['Business Category'],
                            latitude: obj.Lat,
                            longitude: obj.Long,
                        }
                    }
                )
            })
        }
    }, [filteredData])
    
    const onHover = useCallback(event => {
        const {
          features,
          point: {x, y}
        } = event;
        const hoveredFeature = features && features[0];
        setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
      }, []);

    const layerStyle = {
        id: 'point',
        type: 'circle',
        paint: {
          'circle-radius': 7,
          'circle-color': ["get", "riskRatingColor"],
          "circle-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0.4,
          ],
        }
      };

    const renderDecades = () => {
        let currentDecade = startDecade
        const decadeList = []
        while(currentDecade <= endDecade) {
            decadeList.push(currentDecade)
            currentDecade += 10
        }
        return decadeList.map((num) => (
            <li key={num} className={`py-2 hover:bg-gray-800 rounded m-1 p-2 ${decade === num && 'bg-gray-700'}`}>
                <button onClick={() => setDecade(num)}>
                    <span className="hidden sm:inline">{num} - {num+9}</span>
                </button>
            </li>
        ))
    }


    console.log(hoverInfo)
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
                <Map
                    initialViewState={{
                        longitude: -93,
                        latitude: 40,
                        zoom: 3,
                        pitch: 25
                    }}
                    style={{width: 800, height: 600}}
                    mapStyle="mapbox://styles/mapbox/dark-v10"
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                    onMouseMove={onHover}
                    interactiveLayerIds={['point']}
                >

                    <NavigationControl position="top-left" />
                    <ScaleControl />

                     <Source id="riskData" type="geojson" data={geoJson}>
                        <Layer {...layerStyle}/>
                    </Source>

                    {hoverInfo && (
                        <Popup
                            anchor="top"
                            longitude={hoverInfo.feature.properties.longitude}
                            latitude={hoverInfo.feature.properties.latitude}
                            onClose={() => setHoverInfo(null)}
                            closeButton={false}
                        >
                            <div className='text-white bg-inherit'>
                                <div>Asset Name: {hoverInfo.feature.properties.assetName}</div>
                                <div>Business Category: {hoverInfo.feature.properties.businessCategory}</div>
                            </div>
                            
                        </Popup>
                    )}
                </Map>
            </div>
            <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
                <div className="flex sm:flex-col px-2">Table</div>
            </div>
        </div>
    )

}

export default RiskThinking