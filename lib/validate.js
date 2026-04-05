const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isNonEmptyString(value, max = 200) {
  if (typeof value !== "string") return false;
  const t = value.trim();
  return t.length > 0 && t.length <= max;
}

export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const t = email.trim().toLowerCase();
  return t.length <= 320 && EMAIL_RE.test(t);
}

export function sanitizeEmployeeInput(body) {
  return {
    name: typeof body.name === "string" ? body.name.trim() : "",
    email: typeof body.email === "string" ? body.email.trim().toLowerCase() : "",
    position: typeof body.position === "string" ? body.position.trim() : "",
    department: typeof body.department === "string" ? body.department.trim() : "",
  };
}

export function validateEmployeePayload(data, partial = false) {
  const errors = [];

  const check = (ok, msg) => {
    if (!ok) errors.push(msg);
  };

  if (!partial || data.name !== undefined) {
    check(isNonEmptyString(data.name, 120), "Name is required (max 120 characters).");
  }
  if (!partial || data.email !== undefined) {
    check(isValidEmail(data.email), "A valid email is required.");
  }
  if (!partial || data.position !== undefined) {
    check(isNonEmptyString(data.position, 120), "Position is required (max 120 characters).");
  }
  if (!partial || data.department !== undefined) {
    check(isNonEmptyString(data.department, 80), "Department is required (max 80 characters).");
  }

  return errors;
}
