import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export async function GET(req, { params }) {
  const cookieStore = await cookies();

  let token = cookieStore.get("token")?.value;

  if (!token) {
    token = randomUUID();

    cookieStore.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
  }

  return Response.json({ token });
}