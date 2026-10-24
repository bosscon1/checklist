import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { assertStaffUser } from "@/lib/assert-staff";
import {
  defaultSiteContact,
  withDerivedContact,
  type SiteContact,
} from "@/lib/site-contact";

const SETTINGS_ID = "default";

const contactInput = z.object({
  phone: z.string().min(7).max(40),
  email: z.string().email().max(120),
  addressLine: z.string().min(4).max(120),
  cityLine: z.string().min(4).max(120),
  hours: z.string().min(4).max(200),
  serviceArea: z.string().min(8).max(240),
});

type SettingsRow = {
  phone: string;
  email: string;
  address_line: string;
  city_line: string;
  hours: string;
  service_area: string;
  updated_at: string | Date;
  updated_by: string;
};

function fromRow(row: SettingsRow): SiteContact {
  return withDerivedContact({
    phone: row.phone,
    email: row.email,
    addressLine: row.address_line,
    cityLine: row.city_line,
    hours: row.hours,
    serviceArea: row.service_area,
    updatedAt: row.updated_at ? String(row.updated_at) : null,
    updatedBy: row.updated_by || null,
  });
}

async function readSettings(): Promise<SiteContact> {
  const sql = await getSql();
  const rows = await sql<SettingsRow>`
    select phone, email, address_line, city_line, hours, service_area, updated_at, updated_by
    from site_settings
    where id = ${SETTINGS_ID}
    limit 1
  `;
  if (!rows[0]) return defaultSiteContact();
  return fromRow(rows[0]);
}

export const getPublicSiteContact = createServerFn({ method: "GET" }).handler(
  async () => readSettings(),
);

export const getAdminSiteContact = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertStaffUser(context.userId);
    return readSettings();
  });

export const saveAdminSiteContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(contactInput)
  .handler(async ({ data, context }) => {
    await assertStaffUser(context.userId);
    const sql = await getSql();
    await sql`
      insert into site_settings (
        id, phone, email, address_line, city_line, hours, service_area, updated_at, updated_by
      ) values (
        ${SETTINGS_ID},
        ${data.phone.trim()},
        ${data.email.trim()},
        ${data.addressLine.trim()},
        ${data.cityLine.trim()},
        ${data.hours.trim()},
        ${data.serviceArea.trim()},
        now(),
        ${context.userId}
      )
      on conflict (id) do update set
        phone = excluded.phone,
        email = excluded.email,
        address_line = excluded.address_line,
        city_line = excluded.city_line,
        hours = excluded.hours,
        service_area = excluded.service_area,
        updated_at = now(),
        updated_by = excluded.updated_by
    `;
    return readSettings();
  });
