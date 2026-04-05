import DashboardShell from "@/components/DashboardShell";
import EmployeesClient from "@/components/EmployeesClient";

export default function EmployeesPage() {
  return (
    <DashboardShell
      title="Employees"
      subtitle="Search, filter, and manage records"
    >
      <EmployeesClient />
    </DashboardShell>
  );
}
