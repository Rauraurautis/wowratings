
import SearchWithAutocomplete from "./_components/characters/SearchWithAutocomplete"
import { readFromFile } from "./_lib/utils/serverFunctions"
import { setAccessToken } from "./_lib/firebase"
import { ToastContainer } from "react-toastify"
import Image from "next/image"

export default async function Home() {
    const characterData = readFromFile()

    return (
        <>
            <div className="absolute right-0 top-0 p-3 w-[60px] hover:animate-wiggle hidden sm:flex ">
                <a href={"https://github.com/Rauraurautis"} target="_blank">
                    <Image src="/github.png" alt="Github" width={30} height={30} />
                </a>
            </div>
            <ToastContainer position="top-left" />
            <div className="flex flex-col items-center justify-center xl:flex-row xl:items-start xl:justify-between w-[100%] xl:w-[60%] h-[100%] ">
                <SearchWithAutocomplete allCharacters={characterData} />

            </div>
        </>
    )
}
