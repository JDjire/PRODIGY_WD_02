import DashboardShell from "@/components/DashboardShell";
import AddEmployeeClient from "@/components/AddEmployeeClient";

export default function AddEmployeePage() {
  return (
    <DashboardShell
      title="Add employee"
      subtitle="Create a new employee record"
    >
      <AddEmployeeClient />
    </DashboardShell>
  );
}
