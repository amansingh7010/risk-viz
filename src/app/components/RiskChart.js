import { useCallback, useEffect, useMemo, useState } from "react";
import { groupBy } from 'lodash'
import { Line } from "react-chartjs-2";
import axios from "axios";
import { 
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, } from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

Chart.defaults.borderColor = '#36A2EB';
Chart.defaults.color = '#fff';
Chart.defaults.scale.grid.display = false

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Risk Rating Change',
    },
  },
};

const RiskChart = ({ data }) => {
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
 
  const groupedData = useMemo(() => (groupBy(chartData, 'Year')), [chartData])
  console.log(groupedData)

  const lineChartData = useMemo(() => {
    const labels = Object.keys(groupedData)

    return {
      labels,
      datasets: [
        {
          label: 'Average Risk Rating',
          data: labels.map((lab) => groupedData[lab].reduce((total, next) => total + next["Risk Rating"], 0)/groupedData[lab].length)
        }
      ],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  }, [groupedData])

  console.log(lineChartData)

  const noDataJsx = (
    <div className="flex justify-center align-center">
      <span className="text-3xl">Select a point on the map</span>
    </div>
  )

  return !data ? noDataJsx : (
    <Line options={options} data={lineChartData} />
  );
};

export default RiskChart;
