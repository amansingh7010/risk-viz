"use client"; // this is a client component

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import {Grid, Button} from '@mui/material'

const RiskThinking = ({ data, minYear, maxYear }) => {
    console.log(data)
    console.log(minYear)
    console.log(maxYear)

    const mapContainer = useRef(null);
    const map = useRef(null);
    
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    useEffect(() => {
        if (map.current) return
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v10',
          center: [15.4542, 18.7322], // center map on Chad
          zoom: 1.8
      })
    }, [])




    return (
        <Grid container>
            <Grid item xs={12}>
                <div className="map-container" ref={mapContainer} />
            </Grid>
        </Grid>
    )

}

export default RiskThinking