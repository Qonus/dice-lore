"use client";

import { storyInstructions } from "@/app/api/actions";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Send } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { IStoryEntry, useMainContext } from "../context";
import Textarea from "../textarea";

export async function generateMap(prompt: string): Promise<string> {
  const response = await axios.post("/api/generate/image", {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  });
  return response.data.url;
}

export async function dmresponse(text: string, story: IStoryEntry[]) {
  const contents = [
    ...story.map((s) => ({
      role: s.role,
      parts: [{ text: s.content }],
    })),
  ];
  const narration = await axios.post("/api/generate/text", {
    system_instruction: {
      parts: [
        {
          text: storyInstructions + "\n\n\nCampaign, characters: " + text,
        },
      ],
    },
    contents: [{parts: [{text: "Let's begin "}]}, ...contents],
    generationConfig: {
      response_mime_type: "application/json",
    },
  });
  return JSON.parse(narration.data);
}

export default function GameForm() {
  const { campaign, story, setStory, characters } = useMainContext();
  const [map, setMap] = useState("/map_placeholder.jpeg");
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const narrateStory = async () => {
    setIsLoading(true);
    const narration = await dmresponse(
      campaign + "\n\n\n" + JSON.stringify(characters),
      story
    );
    const newMessage = {
      id: Date.now(),
      role: "model",
      content: narration.content,
    };
    console.log(narration.content as string);
    setStory((story) => [...story, newMessage]);
    console.log(story);

    if (narration.updateMap) {
      console.log();
      const mapUrl = await generateMap(narration.mapPrompt);
      setMap(mapUrl);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    narrateStory();
  }, []);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newMessage = {
      id: Date.now(),
      role: "user",
      content: content,
    };
    setStory((story) => [...story, newMessage]);
    await narrateStory();
  };
  return (
    <div className="col gap-5">
    <Image src={`${map}`} width={1000} height={1000} alt="...loading" />
    <div className="flex-wrap gap-4">
      {characters.map((char, i) => (
        <div key={i} className="rounded-xl mb-4 p-4 hover:bg-card border">
          <h2>{char.name}</h2>
          <p>{char.description}</p>
        </div>
      ))}
      </div>
      <form onSubmit={handleSubmit} className="p-5 flex gap-3 items-center">
        <Textarea
          placeholder="Enter your prompt to generate your campaign..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className={cn("rounded-xl", isLoading ? "bg-muted" : "")}
          disabled={isLoading}
        >
          <Send className="size-5" />
        </button>
      </form>
      <div className="col">
        {story.sort((a, b) => b.id - a.id).map((s, i) => (
          <div
            key={i}
            className={cn(
              s.role == "user" ? "ml-auto bg-card" : "",
              "p-3 w-fit max-w-full min-w-1/3 border rounded-xl whitespace-break-spaces max-h-100 overflow-y-scroll"
            )}
          >
            <p>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
