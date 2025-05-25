import fs from 'fs/promises';
import path from "path";
import { generateImage } from "../../actions";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const imageData = await generateImage(body);
    const buffer = Buffer.from(imageData, "base64");

    const dir = "/tmp";
    const filename =  Date.now().toString() + ".png";
    const filePath = path.join(process.env.NODE_ENV == "production" ? "" : process.cwd(), dir, filename);
    await fs.writeFile(filePath, buffer);
    return new Response(JSON.stringify({url: `/api/files/${filename}`}), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.log(e);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: e instanceof Error ? e.message : String(e),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
