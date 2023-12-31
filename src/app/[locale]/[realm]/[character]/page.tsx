
import CharacterInfo from "@/app/_components/characters/CharacterInfo"
import CharacterList from "@/app/_components/characters/CharacterList"
import SearchWithAutocomplete from "@/app/_components/characters/SearchWithAutocomplete"
import { setAccessToken } from "@/app/_lib/firebase"
import { getCharacterFromFile, readFromFile } from "@/app/_lib/utils/serverFunctions"
import { ToastContainer } from "react-toastify"
import Image from "next/image"

export default async function Home({ params }: { params: { locale: string, realm: string, character: string } }) {
    const characterData = readFromFile()
    const character = getCharacterFromFile(params.locale, params.realm, params.character)

    return (
        <>
            <div className="absolute right-0 top-0 p-3 w-[60px] hover:animate-wiggle hidden sm:flex ">
                <a href={"https://github.com/Rauraurautis"} target="_blank">
                    <Image src="/github.png" alt="Github" width={30} height={30} />
                </a>
            </div>
            <ToastContainer position="top-left" />
            <div className="flex flex-col items-center justify-center xl:flex-row xl:items-start xl:justify-between w-[100%] xl:w-[60%] h-[100%] ">
                {characterData && <SearchWithAutocomplete allCharacters={characterData} />}
                <CharacterInfo character={character} />
            </div>
        </>
    )


}
