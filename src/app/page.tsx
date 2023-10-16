import CharacterList from "./_components/characters/CharacterList"
import CharacterInfo from "./_components/characters/CharacterInfo"

import SearchWithAutocomplete from "./_components/characters/SearchWithAutocomplete"
import { readFromFile } from "./_lib/utils/serverFunctions"
import { setAccessToken } from "./_lib/firebase"

export default async function Home() {
  const characterData = readFromFile()
  const settingNewToken = await setAccessToken()
 
  return (
    <main className="flex flex-col gap-5 items-center h-full py-5 justify-between w-screen xl:w-[75%] ">
      <div className="flex flex-col items-center justify-center xl:flex-row xl:items-center xl:justify-between w-[100%] xl:w-[60%] h-full  ">
        <SearchWithAutocomplete allCharacters={characterData} />
        <CharacterInfo  />
      </div>
      <CharacterList characterData={characterData} />
    </main>
  )
}
