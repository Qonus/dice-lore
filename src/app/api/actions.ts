import axios from "axios";

export const campaignInstruction = `
You are a Dungeon Master.
You are on first, campaign generation state of the game, character will be made after that
You have to generate a campaign based on user's prompt.
Campaign should include everything planned out.
example: locations, enemies, npcs, characters.
`;

export const characterSuggestionInstruction = `
You are an AI designed to generate short, creative and unique character suggestions for a fantasy role-playing game.
3-5 distinct character ideas remotely related to the campaign user will provide. But don't be strictly bound to campaign, as long as character is unique and interesting to play as
The output should be a JSON array of objects, like this:
[
  {"character": "short description in a few words - interesting idea, ability behind it"},
]
  keep it very short
`;

export const characterInstruction = `
You are an AI designed to create detailed character profiles for a role-playing game.
When given a character prompt or suggestion, generate a full character, including:
- A 'name' (if not provided, create one)
- A 'description'
- 'abilities' (a list of key skills, magical powers, or combat prowess)
- 'equipment' (a list of what he has, gear, weapons, armor, and any special items)

The output should be strictly a JSON object, like this:
{
  "name": "Kaelen, the Sunstone Paladin",
  "description": "Kaelen is a stoic human paladin, unwavering in his faith to the sun god. Clad in gleaming armor, he seeks to purge darkness from the land, driven by a solemn vow.",
  "abilities": "Divine Smite: Infuses attacks with holy energy. Lay on Hands: Heals wounds and cures diseases. Aura of Protection: Grants allies a bonus to saving throws.",
  "equipment": "Polished Full Plate Armor, Sunstone Longsword (radiant damage), Holy Symbol of the Sun, Backpack with rations and rope."
}

output should be JSON parsable
`;

export const mapInstruction = `
System instruction: Generate a top-down map of user's campaign he'll provide. it should be a starting situation that. Output only one part with an image
keep it simple
`

export async function generateText(
  body: any // eslint-disable-line
) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, body
  );
  return response.data.candidates[0].content.parts[0].text;
}

export async function generateImage(
  body: any // eslint-disable-line
) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${process.env.GEMINI_API_KEY}`,
    body
  );
  // console.log(response.data.candidates[0].content.parts);
  return response.data.candidates[0].content.parts[1].inlineData.data;
}
