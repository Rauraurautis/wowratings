
import CharacterInfo from "@/app/_components/characters/CharacterInfo"
import CharacterList from "@/app/_components/characters/CharacterList"
import SearchWithAutocomplete from "@/app/_components/characters/SearchWithAutocomplete"
import { setAccessToken } from "@/app/_lib/firebase"
import { getCharacterFromFile, readFromFile } from "@/app/_lib/utils/serverFunctions"
import { ToastContainer } from "react-toastify"

export default async function Home({ params }: { params: { locale: string, realm: string, character: string } }) {
    const characterData = readFromFile()
    const character = getCharacterFromFile(params.locale, params.realm, params.character)
    const settingNewToken = await setAccessToken()

    return (
        <main className="flex flex-col items-center h-full py-5 justify-between w-screen xl:w-[75%] ">
            <div className="absolute right-0 top-0 p-3 w-[60px] hover:animate-wiggle">
                <a href={"https://github.com/Rauraurautis"} target="_blank">
                    <img src="/github.png" alt="Github" />
                </a>
            </div>
            <ToastContainer position="top-left" />
            <div className="flex flex-col items-center justify-center xl:flex-row xl:items-start xl:justify-between w-[100%] xl:w-[60%] h-[100%] ">
                <SearchWithAutocomplete allCharacters={characterData} />
                <CharacterInfo character={character} />
            </div>
            <CharacterList characterData={characterData} />
        </main>
    )
}
