"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import EmployeeForm from "@/components/EmployeeForm";

export default function AddEmployeeClient() {
  const router = useRouter();

  async function handleSubmit(values) {
    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Could not create employee");
    }
    toast.success("Employee created");
    router.push("/employees");
    router.refresh();
  }

  return (
    <EmployeeForm
      submitLabel="Create employee"
      onSubmit={handleSubmit}
      cancelHref="/employees"
    />
  );
}
