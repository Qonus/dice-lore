import CampaignForm from "@/components/forms/campaign";
import CharactersForm from "@/components/forms/characters";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container flex flex-col gap-10">
      <CampaignForm />
      <CharactersForm />
      <Link href="/game" className="button m-auto my-10">Start the Game</Link>
    </div>
  )
}
