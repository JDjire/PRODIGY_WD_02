import DashboardShell from "@/components/DashboardShell";
import EditEmployeeClient from "@/components/EditEmployeeClient";

export default function EditEmployeePage({ params }) {
  const { id } = params;

  return (
    <DashboardShell
      title="Edit employee"
      subtitle="Update employee details"
    >
      <EditEmployeeClient id={id} />
    </DashboardShell>
  );
}
