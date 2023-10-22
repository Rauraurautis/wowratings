import CharacterList from "./_components/characters/CharacterList"
import CharacterInfo from "./_components/characters/CharacterInfo"

import SearchWithAutocomplete from "./_components/characters/SearchWithAutocomplete"
import { readFromFile } from "./_lib/utils/serverFunctions"
import { setAccessToken } from "./_lib/firebase"
import { ToastContainer } from "react-toastify"

export default async function Home() {
  const characterData = readFromFile()
  const settingNewToken = await setAccessToken()

  return (
    <main className="flex flex-col items-center h-full py-5 justify-between w-screen xl:w-[75%]">
            <div className="absolute right-0 top-0 p-3 w-[60px] hover:animate-wiggle hidden sm:flex ">
                <a href={"https://github.com/Rauraurautis"} target="_blank">
                    <img src="/github.png" alt="Github" />
                </a>
            </div>
            <ToastContainer position="top-left" />
            <div className="flex flex-col items-center justify-center xl:flex-row xl:items-start xl:justify-between w-[100%] xl:w-[60%] h-[100%] ">
                <SearchWithAutocomplete allCharacters={characterData} />
               
            </div>
            <CharacterList characterData={characterData} />
        </main>
  )
}
