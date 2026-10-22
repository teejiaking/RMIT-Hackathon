import "dotenv/config";
import { z } from "zod";
import { db } from "../lib/db";
let [subject, email, name, role, organisation] = process.argv.slice(2);
if (process.env.AUTH_MODE === "supabase") {
  if (!subject) throw new Error("Provide the immutable Supabase Auth user ID.");
  subject = "supabase:" + subject.replace(/^supabase:/, "");
}
const data = z
  .object({
    subject: z.string().min(1),
    email: z.email(),
    name: z.string().min(2),
    role: z.enum(["STUDENT", "RECIPIENT", "ADMINISTRATOR"]),
    organisation: z.string().optional(),
  })
  .parse({ subject, email, name, role, organisation });
if (!["tidecloak", "supabase"].includes(process.env.AUTH_MODE || ""))
  throw new Error(
    "Set AUTH_MODE=supabase or tidecloak before provisioning real subject mappings.",
  );
if (data.role === "RECIPIENT" && !data.organisation)
  throw new Error("Recipient organisation is required.");
await db.user.upsert({
  where: { subject: data.subject },
  create: { ...data, demo: false },
  update: { ...data, demo: false },
});
console.log(
  process.env.AUTH_MODE === "supabase"
    ? "Provisioned server-managed role for the Supabase subject. User metadata is not used for authorization."
    : "Provisioned subject mapping. Matching TideCloak role is also required.",
);
await db.$disconnect();
