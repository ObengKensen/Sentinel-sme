export const ResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="recharts-container">{children}</div>
);

export const BarChart = () => <div data-testid="bar-chart" />;
export const Bar = () => null;
export const XAxis = () => null;
export const YAxis = () => null;
export const CartesianGrid = () => null;
export const Tooltip = () => null;
export const PieChart = () => <div data-testid="pie-chart" />;
export const Pie = () => null;
export const Cell = () => null;
export const Legend = () => null;
export const LineChart = () => <div data-testid="line-chart" />;
export const Line = () => null;
