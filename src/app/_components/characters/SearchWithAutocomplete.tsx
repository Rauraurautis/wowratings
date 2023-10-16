"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { FullCharacterData } from '../../_lib/types'
import capitalizeString from '../../_lib/utils/capitalizeString'
import { FormEvent, useState } from 'react'
import useCharacterStore from '../../_lib/store/characterStore'
import { addOrUpdateCharacter } from '../../_lib/utils/arenaDataFunctions'
import { addCharacter } from '../../_lib/utils/serverFunctions'
import Spinner from '../random/Spinner'

interface SearchWithAutocompleteProps {
    allCharacters: FullCharacterData[]
}

type CharInfoProps = {
    locale: "eu" | "us"
    nameRealmCombo: string
}

const SearchWithAutocomplete: React.FC<SearchWithAutocompleteProps> = ({ allCharacters }): React.ReactNode => {
    const [charInfo, setCharInfo] = useState<CharInfoProps>({ nameRealmCombo: "", locale: "eu" })
    const [loading, setLoading] = useState(false)
    const { setCharacter } = useCharacterStore()


    const suggestions = charInfo.nameRealmCombo !== "" ? allCharacters.filter(suggestion =>
        suggestion.character.substring(0, charInfo.nameRealmCombo.length).toLowerCase().match(charInfo.nameRealmCombo.toLowerCase()) && suggestion.locale === charInfo.locale) : []

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // const formData = new FormData(e.currentTarget)
        if (!charInfo.nameRealmCombo) {
            alert("Enter something")
            return
        }
        const [name, realm] = charInfo.nameRealmCombo.split("-")
        if (!name || !realm) alert("Something wrong")
        try {
            setLoading(true)
            const character = await addOrUpdateCharacter(name.toLowerCase(), realm.toLowerCase(), charInfo.locale)
            if (character) {
                setCharacter(character)
            }
            setLoading(false)

        } catch (error: any) {
            console.error(error)
            setLoading(false)
        }

    }

    return <div className={`gap-1 min-h-[500px] relative flex flex-col justify-start ${loading ? "items-center" : "items-start"}`}>
        {loading ?
            <Spinner /> :
            <>
                <form onSubmit={handleSubmit} className="flex gap-1">
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
                </form>
                {suggestions.length > 0 ?
                    <div className="relative h-full w-full">
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
    </div>
}

export default SearchWithAutocomplete