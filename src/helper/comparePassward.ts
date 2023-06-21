import bcrypt from "bcrypt";

export async function comparePassword(
  hashedPassword: string,
  password: string
) {
  const isPassword = await bcrypt.compare(hashedPassword, password);
  return isPassword;
}