import React, { useEffect } from "react";
import { CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts";
import lodash from "lodash";

export default function Statistics() {
  const [trainings, setTrainings] = React.useState([]);

  useEffect(() => getTrainings(), []);

  const getTrainings = () => {
    fetch("https://customerrest.herokuapp.com/gettrainings")
      .then((response) => response.json())
      .then((responseData) => setTrainings(responseData));
  };

  const newData = lodash(trainings)
    .groupBy("activity")
    .map((value, key) => ({
      activity: key,
      total: lodash.sumBy(value, "duration"),
    }))
    .value();

  console.log(newData);

  return (
    <BarChart width={1900} height={800} data={newData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="activity" />
      <YAxis
        label={{ value: "Duration (min)", position: "insideLeft", angle: 270 }}
      />
      <Bar dataKey="total" fill="#8884d8" />
    </BarChart>
  );
}
