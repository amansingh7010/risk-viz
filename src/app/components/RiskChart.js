import { useCallback, useEffect, useMemo, useState } from "react";
import { groupBy } from 'lodash'
import { Line } from "react-chartjs-2";
import axios from "axios";

const RiskChart = ({ lngLat }) => {

  const [aggregateBy, setaggregateBy] = useState("businessCategory")
  const [graphData, setGraphData] = useState([])

  useEffect(() => {

    if (lngLat) {
      axios.get(`/api/chart?lng=${lngLat.lng}&lat=${lngLat.lat}`)
      .then((res) => {
        
      })
      .catch((err) => {
        console.log(err)
      })
    }

    
  }, [lngLat])


  console.log(lngLat)

  const noDataJsx = (
    <div className="flex justify-center align-center">
      <span className="text-3xl">Select a point on the map</span>
    </div>
  )

  return !lngLat ? noDataJsx : (
    <h1>Risk Chart</h1>
  );
};

export default RiskChart;
