import DashboardCard from "../components/DashboardCard";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {[...Array(6)].map((_, i) => (
          <DashboardCard key={i} title={`Card #${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
