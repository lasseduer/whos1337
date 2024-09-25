import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(req: NextApiRequest) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World foobar" }, { status: 200 });
}

// To handle a GET request to /api
export async function POST(req: NextApiRequest) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World foobar POST" }, { status: 200 });
}
