"use server"

import axiosInstance from "../axiosInstance"
import { getAccessToken } from "../firebase"
import { FullCharacterData, HighestRatings } from "../types"
import { derivePvpAchievements } from "./arenaDataHelpers"
import { addCharacter } from "./serverFunctions"


const specRanking = async (classSpec: string, character: string, token: string): Promise<number> => {
    const res = await axiosInstance.get(`https://eu.api.blizzard.com/data/wow/pvp-season/36/pvp-leaderboard/shuffle-${classSpec}?namespace=dynamic-eu&access_token=${token}`)
    const data: any[] = res.data.entries
    const characterRank = data.filter((entry) => entry.character.name.toLowerCase() === character)
    return characterRank.length === 0 ? 999999 : characterRank[0].rank
}

const bracketApiAddress = (character: string, realm: string, locale: string, token: string, category: string) => (`https://${locale}.api.blizzard.com/profile/wow/character/${realm}/${character.toLowerCase()}/pvp-bracket/${category}?namespace=profile-${locale}&locale=en_GB&access_token=${token}`)

const characterImageApiAddress = (character: string, realm: string, token: string, locale: string) => (`https://${locale}.api.blizzard.com/profile/wow/character/${realm}/${character.toLowerCase()}/character-media?namespace=profile-${locale}&locale=en_GB&access_token=${token}`)

const characterStatsApiAddress = (character: string, realm: string, token: string, locale: string) => (`https://${locale}.api.blizzard.com/profile/wow/character/${realm}/${character.toLowerCase()}/achievements/statistics?namespace=profile-${locale}&locale=en_GB&access_token=${token}`)

const characterAchievementsApiAddress = (character: string, realm: string, token: string, locale: string) => (`https://${locale}.api.blizzard.com/profile/wow/character/${realm}/${character.toLowerCase()}/achievements?namespace=profile-${locale}&locale=en_GB&access_token=${token}`)


const getRatingFromAPI = async (character: string, realm: string, locale: string, token: string, category: string): Promise<number> => {
    try {
        const res = await axiosInstance.get(bracketApiAddress(character, realm, locale, token, category))
        return res.data.rating
    } catch (error) {
        return 0
    }
}

const getImageFromAPI = async (character: string, realm: string, locale: string, token: string): Promise<string> => {
    try {
        const res = await axiosInstance.get(characterImageApiAddress(character, realm, token, locale))
        return res.data.assets[1].value
    } catch (error) {
        return ""
    }
}

const getArenaExperienceFromAPI = async (character: string, realm: string, locale: string, token: string): Promise<HighestRatings> => {
    try {
        const highestArena = await axiosInstance.get(characterStatsApiAddress(character, realm, token, locale))
        const achievements = await axiosInstance.get(characterAchievementsApiAddress(character, realm, token, locale))

        let category = null

        // Finds the pvp category of arenas in statistics (does not exist on all characters, stays null and returns undefined if it doesn't)
        for (const cat of highestArena.data.categories) {
            if (cat.id === 21) {
                category = cat
                break
            }
        }
        const pvpStats = category.sub_categories[0].id === 152 ? category.sub_categories[0].statistics : undefined

        const [threes, twos] = pvpStats ? pvpStats.filter((statistics: any) => statistics.id === 595 || statistics.id === 370) : [0, 0]
        const highestRbg = derivePvpAchievements(achievements.data.achievements)
        return { highestThrees: threes.quantity, highestTwos: twos.quantity, highestRbg: highestRbg.highestRbg }
    } catch (error) {
        console.error(error)
        return { highestThrees: 0, highestTwos: 0, highestRbg: 0 }
    }
}






const getArenaData = async (character: string, realm: string, locale: string): Promise<FullCharacterData | null> => {
    try {
        const { token } = await getAccessToken()
        realm = realm.replaceAll(" ", "-")
        const charInfo = await axiosInstance.get(`https://${locale}.api.blizzard.com/profile/wow/character/${realm}/${character}?namespace=profile-${locale}&locale=en_US&access_token=${token}`)
        const { id, character_class, active_spec } = charInfo.data
        const charClass = character_class.name.toLowerCase()
        const charSpec = active_spec.name.toLowerCase()
        const classSpec = `${charClass.replace(" ", "")}-${charSpec.replace(" ", "")}`
        const shuffle = await getRatingFromAPI(character, realm, locale, token, `shuffle-${classSpec}`)
        const twos = await getRatingFromAPI(character, realm, locale, token, `2v2`)
        const threes = await getRatingFromAPI(character, realm, locale, token, `3v3`)
        const rbgs = await getRatingFromAPI(character, realm, locale, token, `rbg`)
        const shuffleRank = await specRanking(classSpec, character, token)
        const image = await getImageFromAPI(character, realm, locale, token)
        const highestRatings = await getArenaExperienceFromAPI(character, realm, locale, token)
        return { id, character, realm, locale, twos, threes, rbgs, shuffle, shuffleRank, charClass, charSpec, time: null, image, highestRatings }
    } catch (error: any) {
        console.error(error.code)
        return null
    }
}

const addOrUpdateCharacter = async (name: string, realm: string, locale: string) => {
    const playerArenaData = await getArenaData(name.toLowerCase(), realm.toLowerCase(), locale)
    if (!playerArenaData) throw Error("No player arena data")
    const character = await addCharacter(playerArenaData)
    if (character) {
        return character
    }
}


export { getArenaData, addOrUpdateCharacter }