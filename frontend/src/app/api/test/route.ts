export async function GET() {
    console.log('ACCESS_KEY:', process.env.ACCESS_KEY);
    console.log('MAP_API_KEY:', process.env.MAP_API_KEY);
    return Response.json({ ok: true });
}
