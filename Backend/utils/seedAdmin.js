import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed.");
    return;
  }

  try {
    const existing = await User.findOne({ email });

    if (existing) {
      // Ensure existing user has admin role
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
        console.log(`✅ Existing user ${email} promoted to admin.`);
      }
      return;
    }

    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
      authProvider: "local",
    });

    console.log(`✅ Admin user created: ${email}`);
  } catch (error) {
    console.error("❌ Admin seed error:", error.message);
  }
};

export default seedAdmin;
