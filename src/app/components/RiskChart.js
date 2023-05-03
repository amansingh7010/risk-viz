import { useCallback, useEffect, useMemo, useState } from "react";
import { groupBy } from 'lodash'
import { Line } from "react-chartjs-2";
import axios from "axios";

const RiskChart = ({ data }) => {

  const [aggregateBy, setaggregateBy] = useState("businessCategory")
  const [chartData, setChartData] = useState([])

  useEffect(() => {

    if (data) {
      axios.get(`/api/chart?lng=${data.Long}&lat=${data.Lat}`)
      .then((res) => {
        setChartData(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    }

    
  }, [data])

  const noDataJsx = (
    <div className="flex justify-center align-center">
      <span className="text-3xl">Select a point on the map</span>
    </div>
  )

  return !data ? noDataJsx : (
    <h1>Risk Chart</h1>
  );
};

export default RiskChart;
