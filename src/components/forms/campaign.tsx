"use client";

import { campaignInstruction } from "@/app/api/actions";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import Textarea from "../textarea";

export default function CampaignForm() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCampaign("Loading...");
    const newCampaign = await axios.post("/api/generate/text", {
      system_instruction: {
        parts: [
          {
            text: campaignInstruction,
          },
        ],
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: content,
            },
          ],
        },
      ],
    });
    console.log(newCampaign.data);
    setCampaign(newCampaign.data);
    setIsLoading(false);
  };

  return (
    <div className="p-5 border rounded">
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
      <div className="max-h-100 overflow-y-scroll p-4">
        <h2 className="mb-4">Your Campaign:</h2>
        <Textarea
          placeholder="Write your campaign..."
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
        />
      </div>
    </div>
  );
}
