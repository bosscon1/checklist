import { getSql } from "@/lib/db";
import { isStaffEmail, staffEmailError } from "@/lib/staff-email";

export async function assertStaffUser(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ email: string }>`
    select email from "user" where id = ${userId} limit 1
  `;
  if (!isStaffEmail(rows[0]?.email)) {
    throw new Error(staffEmailError());
  }
}
