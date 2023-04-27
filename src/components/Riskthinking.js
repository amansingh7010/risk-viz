"use client"; // this is a client component

import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const RiskThinking = ({ data, minYear, maxYear }) => {
    // console.log(data)
    console.log(minYear)
    console.log(maxYear)

    const [decade, setDecade] = useState(minYear)
    const mapContainer = useRef(null);
    const map = useRef(null);
    
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    useEffect(() => {
        if (map.current) return
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v10',
          center: [15.4542, 18.7322], // center map on Chad
          zoom: 1.8
      })
    }, [])


    const handleChange = (event) => {
        setDecade(event.target.value);
    };

    return (
        <>
        <div container>
            <div className="map-container" ref={mapContainer} />
        </div>
        </>
    )

}

export default RiskThinking