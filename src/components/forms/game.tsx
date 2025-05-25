"use client";

import { mapInstruction } from "@/app/api/actions";
import axios from "axios";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useMainContext } from "../context";

export default function GameForm() {
  const { campaign } = useMainContext();
  const [map, setMap] = useState("/api");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await axios.post("/api/generate/image", {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: mapInstruction + "\n\n\n" + campaign,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });
    console.log(response.data);
    setMap(response.data.url);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
        <div className="w-full h-fit">
        <Image src={`${map}`} width={1000} height={1000} alt="map" />
        </div>
      </form>
    </div>
  );
}
