export async function GET() {
  return Response.json({
    backend_url: process.env.NEXT_PUBLIC_BACKEND_URL ?? "undefined",
  })
}
