"use client"
import { FC } from 'react'
import { FullCharacterData } from '../../_lib/types'
import useCharacterStore from '../../_lib/store/characterStore'
import capitalizeString from '../../_lib/utils/capitalizeString'
import classColors, { ClassColors } from '../../_lib/utils/classColors'
import { formatDistance } from 'date-fns'
import { addOrUpdateCharacter } from '../../_lib/utils/arenaDataFunctions'

const boxThemes = {
    container: "min-w-[50px] min-h-[50px] md:min-w-[80px] md:min-h-[80px] bg-indigo-500 flex flex-col justify-around items-center",
    bracket: "text-2xl font-semibold text-indigo-900 text-center leading-6",
    rating: "text-xl font-semibold text-indigo-200"
}

const CharacterInfo: FC = ({ }) => {
    const { selectedCharacter, setCharacter } = useCharacterStore()
    const currentTime = new Date().getTime()

    if (selectedCharacter) {
        const { twos, threes, rbgs, shuffle, shuffleRank, character: name, realm, charClass, time, image, locale, highestRatings } = selectedCharacter
        
        const handleRefreshClick = async () => {
            const character = await addOrUpdateCharacter(name, realm, locale)
            if (character) {
                setCharacter(character)
            }
        }

        return <div className="  w-full flex flex-col justify-between items-center  break-keep xl:w-auto animate-fadeIn ">
            <div className="flex flex-col items-center gap-4">
                <div className="border-b-[1px] p-2 w-[90%] text-center border-gray-500 relative xl:w-full">
                    <h2 className="text-white text-2xl">
                        <span style={{ color: classColors[charClass as keyof ClassColors] }}>
                            {capitalizeString(name)}
                        </span>-{capitalizeString(realm)}
                    </h2>
                </div>
                <div className="max-w-[300px]">
                    <a href={`https://worldofwarcraft.blizzard.com/en-gb/character/${locale}/${realm}/${name}`} target='_blank'>
                        <img src={image} alt="No image" className="w-full h-full hover:brightness-125" />
                    </a>
                </div>
                <div className="flex gap-2 items-center  w-full justify-around">
                    <h2 className="text-white text-xl">Updated {formatDistance(currentTime, time || 0, { includeSeconds: true })} ago</h2>
                    <p className="cursor-pointer" onClick={handleRefreshClick}>🔃</p>
                </div>
                {shuffleRank !== 999999 ? <h2 className="text-white text-xl">Shuffle rank: {shuffleRank}</h2> : ""}
            </div>
            <div className="flex gap-5 pt-5">
                <div className={boxThemes.container}>
                    <h1 className={boxThemes.bracket}>2v2</h1>
                    <div className="text-xs text-center ">
                        <p>Current</p>
                        <h1 className={boxThemes.rating}>{twos}</h1>
                    </div>
                    <div className="text-xs text-center ">
                        <p className="">Record</p>
                        <h1 className={boxThemes.rating}>{highestRatings.highestTwos}</h1>
                    </div>
                </div>
                <div className={boxThemes.container}>
                    <h1 className={boxThemes.bracket}>3v3</h1>
                    <div className="text-xs text-center">
                        <p>Current</p>
                        <h1 className={boxThemes.rating}>{threes}</h1>
                    </div>
                    <div className="text-xs text-center ">
                        <p className="">Record</p>
                        <h1 className={boxThemes.rating}>{highestRatings.highestThrees}</h1>
                    </div>
                </div>
                <div className={boxThemes.container}>
                    <h1 className={boxThemes.bracket}>RBG</h1>
                    <div className="text-xs text-center">
                        <p>Current</p>
                        <h1 className={boxThemes.rating}>{rbgs}</h1>
                    </div>
                    <div className="text-xs text-center ">
                        <p className="">Record</p>
                        <h1 className={boxThemes.rating}>{highestRatings.highestRbg}</h1>
                    </div>
                </div>
                <div className={boxThemes.container}>
                    <h1 className={boxThemes.bracket}>Shuffle</h1>
                    <div className="text-xs text-center">
                        <p>Current</p>
                        <h1 className={boxThemes.rating}>{threes}</h1>
                    </div>
                    <div className="text-xs text-center ">
                        <p className="">Record</p>
                        <h1 className={boxThemes.rating}>{highestRatings.highestThrees}</h1>
                    </div>
                </div>
            </div>
        </div>

    }

    return <div className=" min-h-[400px] w-full flex flex-col justify-between items-center p-1 break-keep md:w-auto  ">

    </div>

}

export default CharacterInfo