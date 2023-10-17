"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { FullCharacterData } from '../../_lib/types'
import capitalizeString from '../../_lib/utils/capitalizeString'
import { FormEvent, useState } from 'react'
import useCharacterStore from '../../_lib/store/characterStore'
import { addOrUpdateCharacter } from '../../_lib/utils/arenaDataFunctions'
import { addCharacter } from '../../_lib/utils/serverFunctions'
import Spinner from '../random/Spinner'
import { characterSearchSchema } from '@/app/_lib/zod/schemas'
import { toast } from 'react-toastify'
import SpecialCharacters from '../random/SpecialCharacters'

interface SearchWithAutocompleteProps {
    allCharacters: FullCharacterData[]
}

export type CharInfoProps = {
    locale: "eu" | "us"
    nameRealmCombo: string
}

const SearchWithAutocomplete: React.FC<SearchWithAutocompleteProps> = ({ allCharacters }): React.ReactNode => {
    const [charInfo, setCharInfo] = useState<CharInfoProps>({ nameRealmCombo: "", locale: "eu" })
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [keyboard, setKeyboard] = useState(false)
    const { setCharacter } = useCharacterStore()
    console.log(charInfo)

    const suggestions = charInfo.nameRealmCombo !== "" ? allCharacters.filter(suggestion =>
        suggestion.character.substring(0, charInfo.nameRealmCombo.length).toLowerCase().match(charInfo.nameRealmCombo.toLowerCase()) && suggestion.locale === charInfo.locale) : []

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const validation = characterSearchSchema.safeParse(charInfo)

        if (validation.success) {
            try {
                setLoading(true)
                const [name, realm] = charInfo.nameRealmCombo.split("-")
                const character = await addOrUpdateCharacter(name.toLowerCase(), realm.toLowerCase(), charInfo.locale)
                if (character) {
                    router.push(`/${character.locale}/${character.realm}/${character.character}`)
                }
                setLoading(false)

            } catch (error: any) {
                console.error(error)
                toast.error("Cannot find a character with that name!")
                setLoading(false)
            }
        } else {
            toast.error(validation.error.errors[0].message)
        }


    }

    return <div className={`gap-1 p-2 min-w-[300px] relative h-full  flex flex-col justify-start ${loading ? "items-center" : "items-start"} `}>

        {loading ?
            <div className="w-[50px]"><Spinner size={10} /></div> :
            <>

                <form onSubmit={handleSubmit} className="flex gap-1 w-full h-[35px]">

                    <select className="p-1 rounded-md bg-slate-300 border-slate-600 border-2 hover:border-slate-400 focus:outline-none" name="locale" onChange={e => setCharInfo(prev => ({ ...prev, locale: e.target.value as "eu" | "us" }))}>
                        <option value="eu">EU</option>
                        <option value="us">US</option>
                    </select>
                    <input
                        className="p-1 rounded-md bg-slate-300 border-slate-600 border-2 hover:border-slate-400 focus:outline-none w-full"
                        type="text"
                        name="nameRealmCombo"
                        value={charInfo.nameRealmCombo}
                        onChange={e => setCharInfo(prev => ({ ...prev, nameRealmCombo: e.target.value }))} />
                    <button className="p-1 rounded-md bg-slate-300 border-slate-600 border-2 hover:border-slate-400 focus:outline-none">🔍</button>
                    <button className="p-1 rounded-md bg-slate-300 border-slate-600 border-2 hover:border-slate-400 focus:outline-none" type="button" onClick={() => setKeyboard(prev => !prev)}>⌨️</button>
                </form>
                {suggestions.length > 0 ?
                    <div className="absolute p-2 top-[35px] h-full w-full ">
                        <div className="bg-slate-400 p-1 rounded-b-md transition-all absolute right-0 left-0">
                            <ul>
                                {suggestions.map((suggestion, i) => {
                                    const nameAndRealm = `${capitalizeString(suggestion.character)}-${capitalizeString(suggestion.realm)}`
                                    return (
                                        <li key={i} className="cursor-pointer hover:text-blue-800" onClick={() => setCharInfo(prev => ({ ...prev, nameRealmCombo: nameAndRealm }))}>{nameAndRealm}</li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    : ""}
            </>
        }
        {keyboard ? <div className="w-[300px] h-[300px] p-2 flex flex-wrap justify-center gap-2 absolute mt-10 xl:mt-0 xl:bottom-0 z-40">
            <SpecialCharacters setCharInfo={setCharInfo} />
        </div> : ""}

    </div>
}

export default SearchWithAutocomplete