import { useCallback, useEffect, useMemo, useState } from "react";
import { groupBy } from 'lodash'
import { Line } from "react-chartjs-2";

const RiskChart = ({ lngLat, startDecade, endDecade }) => {

  const [aggregateBy, setaggregateBy] = useState("businessCategory")
  const [graphData, setGraphData] = useState([])

  const xLabels = useMemo(() => {
    const arr = []
    let currentDecade = startDecade
    while (currentDecade <= endDecade) {
      arr.push(currentDecade)
      currentDecade = currentDecade+10
    }
    return arr
  }, [startDecade, endDecade])

  console.log(lngLat, graphData)

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
