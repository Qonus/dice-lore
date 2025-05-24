"use client";

import {
    characterInstruction,
    characterSuggestionInstruction,
} from "@/app/api/actions";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Send, X } from "lucide-react";
import { useState } from "react";
import { ICharacter, useMainContext } from "../context";
import Textarea from "../textarea";

interface CharacterSuggestion{
    character: string
}

export default function CharactersForm() {
  const [prompt, setPrompt] = useState("");
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [characterSuggestions, setCharacterSuggestions] = useState<CharacterSuggestion[]>(
    []
  );
  const { characters, setCharacters, campaign } = useMainContext();

  const generateSuggestions = async () => {
    setIsLoadingSuggestions(true);
    setCharacterSuggestions([{character: "Loading..."}]);
    try {
      const response = await axios.post("/api/generate/text", {
        system_instruction: {
          parts: [{ text: characterSuggestionInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: campaign || "fantasy characters" }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
        },
      });
    //   console.log(response.data);
      const suggestions: CharacterSuggestion[] = JSON.parse(response.data);
      setCharacterSuggestions(suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleAddCharacter = async (characterPrompt: string) => {
    setIsLoadingCharacter(true);
    try {
      const response = await axios.post("/api/generate/text", {
        system_instruction: {
          parts: [{ text: characterInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: characterPrompt }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
        },
      });
      const newCharacter: ICharacter = {
        id: Date.now(),
        ...JSON.parse(response.data),
      };
      setCharacters((prev) => [...prev, newCharacter]);
    } catch (error) {
      console.error("Error adding character:", error);
    } finally {
      setIsLoadingCharacter(false);
      setPrompt("");
    }
  };

  const handleCharacterChange = (
    id: number,
    field: keyof ICharacter,
    value: string
  ) => {
    setCharacters((prev) =>
      prev.map((char) => (char.id === id ? { ...char, [field]: value } : char))
    );
  };

  const handleRemoveCharacter = (id: number) => {
    setCharacters((prev) => prev.filter((char) => char.id !== id));
  };

  return (
    <div className="p-5 border rounded">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddCharacter(prompt);
        }}
        className="col gap-5"
      >
        <h1>Your Characters:</h1>
        <button
          type="button"
          className={cn(
            "rounded-xl p-2",
            isLoadingSuggestions ? "bg-muted" : ""
          )}
          onClick={generateSuggestions}
        >
          Suggest Characters
        </button>
        {characterSuggestions.length > 0 && (
          <div className="col">
            {characterSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg cursor-pointer hover:bg-card transition-colors"
                onClick={() => handleAddCharacter(suggestion.character)}
              >
                <h3 className="font-bold text-md">{suggestion.character}</h3>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          <Textarea
            placeholder="Enter your prompt to generate character suggestions or directly add a character..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            className={cn(
              "rounded-xl p-2",
              isLoadingCharacter ? "bg-muted" : ""
            )}
            disabled={isLoadingCharacter}
          >
            <Send className="size-5" />
          </button>
        </div>
      </form>

      {isLoadingSuggestions && (
        <div className="p-4 text-center text-muted-foreground">
          Generating suggestions...
        </div>
      )}

      <div className="mt-6 p-4 border-t">
        <h2 className="mb-4 text-lg font-semibold">Your Characters:</h2>
        {characters.length === 0 && (
          <p className="text-muted-foreground">No characters added yet.</p>
        )}
        <div className="col gap-6">
          {characters.sort((a, b) => b.id - a.id).map((character) => (
            <div
              key={character.id}
              className="p-5 border rounded-lg shadow-sm relative"
            >
              <button
                onClick={() => handleRemoveCharacter(character.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-card text-destructive hover:bg-accent"
                aria-label="Remove character"
              >
                <X className="size-4" />
              </button>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name:
                </label>
                <Textarea
                  value={character.name}
                  onChange={(e) =>
                    handleCharacterChange(character.id, "name", e.target.value)
                  }
                  className="!min-h-10"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description:
                </label>
                <Textarea
                  value={character.description}
                  onChange={(e) =>
                    handleCharacterChange(
                      character.id,
                      "description",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Abilities:
                </label>
                <Textarea
                  value={character.abilities}
                  onChange={(e) =>
                    handleCharacterChange(
                      character.id,
                      "abilities",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Equipment:
                </label>
                <Textarea
                  value={character.equipment}
                  onChange={(e) =>
                    handleCharacterChange(
                      character.id,
                      "equipment",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
