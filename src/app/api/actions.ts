import axios from "axios";

export const campaignInstruction = `
You are a Dungeon Master.
You are on first, campaign generation state of the game, character will be made after that
You have to generate a campaign based on user's prompt.
Campaign should include everything planned out.
example: locations, enemies, npcs, characters.
`;

export async function generateText(
  body: any // eslint-disable-line
) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, body
  );
  return response.data.candidates[0].content.parts[0].text;
}

export async function generateImage(
  contents: { role: string; parts: { text: string }[] }[]
) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: contents,
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    }
  );
  const imageData =
    response.data.candidates[0].content.parts[0].inlinedata.data;
  const buffer = Buffer.from(imageData);
  return buffer;
}
