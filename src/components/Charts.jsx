import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Charts({ data }) {
  const chartData = data.map((m, i) => ({
    name: i + 1,
    kd: m.deaths === 0 ? m.kills : (m.kills / m.deaths).toFixed(2),
  }));

  return (
    <LineChart width={500} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="kd" />
    </LineChart>
  );
}