import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import { sanitizeEmployeeInput, validateEmployeePayload } from "@/lib/validate";

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const employees = await Employee.find({}).sort({ createdAt: -1 }).lean();
    const data = employees.map((e) => ({
      id: e._id.toString(),
      name: e.name,
      email: e.email,
      position: e.position,
      department: e.department,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));
    return NextResponse.json({ employees: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load employees" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data = sanitizeEmployeeInput(body);
  const errors = validateEmployeePayload(data, false);
  if (errors.length) {
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  try {
    await connectDB();
    const created = await Employee.create(data);
    return NextResponse.json(
      {
        employee: {
          id: created._id.toString(),
          name: created.name,
          email: created.email,
          position: created.position,
          department: created.department,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "An employee with this email already exists" },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
