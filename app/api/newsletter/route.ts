import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let email = "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      email = (body?.email as string) ?? "";
    } else {
      const formData = await request.formData();
      email = (formData.get("email") as string) ?? "";
    }

    // Placeholder: hook into CRM/email provider here.
    if (!email || !email.includes("@")) {
      return NextResponse.redirect(new URL("/newsletter/error", request.url));
    }

    return NextResponse.redirect(new URL("/newsletter/success", request.url));
  } catch {
    return NextResponse.redirect(new URL("/newsletter/error", request.url));
  }
}

