import { useCallback, useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { GlobeAmericasIcon, BriefcaseIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

Chart.defaults.borderColor = "#36A2EB";
Chart.defaults.color = "#fff";
Chart.defaults.scale.grid.display = false;

const RiskChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  const getTopRiskFactors = useCallback(
    (label) => {
      const topRiskFactors = chartData.topRiskFactors[label];
      return `Top 3 Risk Factors:\n${Object.keys(topRiskFactors).join("\n")}`;
    },
    [chartData]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Risk Rating Change",
        },
        tooltip: {
          callbacks: {
            afterBody: (context) => getTopRiskFactors(context[0].label),
          },
        },
      },
    }),
    [getTopRiskFactors]
  );

  useEffect(() => {
    if (data) {
      axios
        .get(`/api/chart?lng=${data.Long}&lat=${data.Lat}`)
        .then((res) => {
          setChartData(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [data]);

  const lineChartData = useMemo(() => {
    return {
      labels: chartData.labels,
      datasets: [
        {
          label: "Average Risk Rating",
          data: chartData.averageRiskRating,
        },
      ],
    };
  }, [chartData]);

  const noDataJsx = (
    <div className="flex justify-center align-center">
      <GlobeAmericasIcon className="mr-4 w-8" />
      <span className="text-3xl">Select a point on the map</span>
    </div>
  );

  return !data ? (
    noDataJsx
  ) : (
    <div>
      <div className="flex">
        <BriefcaseIcon className="mr-1 w-4" />
        <span> Name: {data["Asset Name"]}</span>
      </div>
      <div className="flex">
        <BuildingOfficeIcon className="mr-1 w-4" />
        <span> Category: {data["Business Category"]}</span>
      </div>
      <div>
        <Line options={options} data={lineChartData} />
      </div>
    </div>
  );
};

export default RiskChart;
