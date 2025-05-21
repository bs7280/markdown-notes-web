// app/api/edit-note/route.ts

import { editNote } from "@/lib/github";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { filename, content } = await req.json();

    if (!filename || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await editNote(filename, content);

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error("Edit note error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
