import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import { sanitizeEmployeeInput, validateEmployeePayload } from "@/lib/validate";

function badId() {
  return NextResponse.json({ error: "Invalid employee id" }, { status: 400 });
}

export async function GET(request, { params }) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return badId();
  }

  try {
    await connectDB();
    const e = await Employee.findById(id).lean();
    if (!e) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    return NextResponse.json({
      employee: {
        id: e._id.toString(),
        name: e.name,
        email: e.email,
        position: e.position,
        department: e.department,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load employee" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return badId();
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = sanitizeEmployeeInput(body);
  const data = {};
  if (body.name !== undefined) data.name = raw.name;
  if (body.email !== undefined) data.email = raw.email;
  if (body.position !== undefined) data.position = raw.position;
  if (body.department !== undefined) data.department = raw.department;

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  const errors = validateEmployeePayload({ ...data }, true);
  if (errors.length) {
    return NextResponse.json({ error: errors[0] }, { status: 400 });
  }

  try {
    await connectDB();
    const updated = await Employee.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json({
      employee: {
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        position: updated.position,
        department: updated.department,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "An employee with this email already exists" },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return badId();
  }

  try {
    await connectDB();
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
