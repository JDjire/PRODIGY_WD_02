import { config } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });
config({ path: resolve(__dirname, "../.env") });

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    name: { type: String, trim: true, default: "Admin" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

const resetPassword = process.argv.includes("--reset-password");

async function main() {
  const uri = process.env.MONGODB_URI;
  const emailRaw = process.env.ADMIN_EMAIL;
  const passwordRaw = process.env.ADMIN_PASSWORD;

  if (!uri || !String(uri).trim()) {
    console.error(
      "Missing MONGODB_URI.\n" +
        "  1. Copy .env.example to .env.local in the project folder\n" +
        "  2. Set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD\n" +
        "  3. Run: npm run seed"
    );
    process.exit(1);
  }
  if (!emailRaw || !passwordRaw) {
    console.error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local (see .env.example)"
    );
    process.exit(1);
  }

  const email = String(emailRaw).trim().toLowerCase();
  const password = String(passwordRaw).trim();

  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters (after trim).");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const existing = await User.findOne({ email });

  if (existing && resetPassword) {
    const hash = await bcrypt.hash(password, 12);
    await User.findOneAndUpdate({ email }, { password: hash });
    console.log("Admin password updated for:", email);
    console.log("Sign in with that email and ADMIN_PASSWORD from .env.local.");
    await mongoose.disconnect();
    return;
  }

  if (existing) {
    console.log("Admin already exists for:", email);
    console.log(
      "Sign in using exactly ADMIN_EMAIL and ADMIN_PASSWORD from .env.local."
    );
    console.log(
      "Wrong password? Run:  npm run seed -- --reset-password  (updates hash from .env.local)"
    );
    await mongoose.disconnect();
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await User.create({
    email,
    password: hash,
    name: "Admin",
  });

  console.log("Admin user created:", email);
  console.log("Sign in with the email and password above (from .env.local).");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
