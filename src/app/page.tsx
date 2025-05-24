import CampaignForm from "@/components/forms/campaign";
import CharactersForm from "@/components/forms/characters";

export default function Home() {
  return (
    <div className="container flex flex-col gap-10">
      <CampaignForm />
      <CharactersForm />
      <button className="m-auto my-10">Start the Game</button>
    </div>
  )
}
