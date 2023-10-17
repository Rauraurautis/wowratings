"use client"
import { FC, useEffect, useState } from 'react'
import { formatDistance } from 'date-fns'
import capitalizeString from '../../_lib/utils/capitalizeString'
import getHighestRating from '../../_lib/utils/getHighestRating'
import classColors, { ClassColors } from '../../_lib/utils/classColors'
import useCharacterStore from '../../_lib/store/characterStore'
import { readFromFile } from '../../_lib/utils/serverFunctions'
import { FullCharacterData } from '../../_lib/types'
import { useRouter } from 'next/navigation'

interface CharacterListProps {
    characterData: FullCharacterData[]
}

const CharacterList: FC<CharacterListProps> = ({ characterData }) => {
    const router = useRouter()



    const currentTime = new Date().getTime()
    const { setCharacter } = useCharacterStore()

    return <div className="w-[80%] flex flex-col items-center justify-center break-keep xl:w-[60%] min-w-[400px] h-full overflow-y">
        <h1 className="text-white text-2xl border-b-[1px] border-gray-500 w-[90%] text-center p-1">Most recent searches</h1>
        <table className="w-full border-separate border-spacing-y-2 border-solid">
            <thead>
                <tr className="text-white p-3 rounded-md text-lg font-semibold font-sans">
                    <th className="text-start">Name</th>
                    <th className="text-start">Highest rating</th>
                    <th className="text-end">Last time searched</th>
                </tr>
            </thead>
            <tbody className="p-1">
                {characterData ?
                    characterData.slice(0, 10).map((char, i) => (
                        <tr key={i} className="text-white border bg-blue-500 bg-opacity-20 rounded-md text-lg font-normal font-sans cursor-pointer" onClick={() => router.push(`/${char.locale}/${char.realm}/${char.character}`)}>
                            <td className="p-1 md:p-2 text-start text-sm md:text-base"><span style={{ color: classColors[char.charClass as keyof ClassColors] }}>{capitalizeString(char.character)}</span>-{capitalizeString(char.realm)}</td>
                            <td className="p-1 md:p-2 text-start ">{capitalizeString(getHighestRating(char))}</td>
                            <td className="p-1 md:p-2 text-end">{formatDistance(currentTime, char.time || 0, { includeSeconds: true })} ago</td>
                        </tr>
                    )) : <h1>No data</h1>}
            </tbody>
        </table>
    </div>
}

export default CharacterList