"use server"

import axiosInstance from "../axiosInstance"
import { getAccessToken } from "../firebase"
import { FullCharacterData } from "../types"
import { addCharacter } from "./serverFunctions"


const specRanking = async (classSpec: string, character: string, token: string): Promise<number> => {
    const res = await axiosInstance.get(`https://eu.api.blizzard.com/data/wow/pvp-season/35/pvp-leaderboard/shuffle-${classSpec}?namespace=dynamic-eu&access_token=${token}`)
    const data: any[] = res.data.entries
    const characterRank = data.filter((entry) => entry.character.name.toLowerCase() === character)
    return characterRank.length === 0 ? 999999 : characterRank[0].rank
}

const bracketApiAddress = (character: string, realm: string, locale: string, token: string, category: string) => (`https://${locale}.api.blizzard.com/profile/wow/character/${realm}/${character.toLowerCase()}/pvp-bracket/${category}?namespace=profile-${locale}&locale=en_GB&access_token=${token}`)

const characterImageApiAddress = (character: string, realm: string, token: string, locale: string) => (`https://${locale}.api.blizzard.com/profile/wow/character/${realm}/${character.toLowerCase()}/character-media?namespace=profile-${locale}&locale=en_GB&access_token=${token}`)

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

const getArenaData = async (character: string, realm: string, locale: string): Promise<FullCharacterData | null> => {
    try {
        const token = await getAccessToken()
        realm = realm.replaceAll(" ", "-")
        const charInfo = await axiosInstance.get(`https://${locale}.api.blizzard.com/profile/wow/character/${realm}/${character}?namespace=profile-${locale}&locale=en_US&access_token=${token}`)
        const charClass = charInfo.data.character_class.name.toLowerCase()
        const charSpec = charInfo.data.active_spec.name.toLowerCase()
        const classSpec = `${charClass}-${charSpec}`
        const shuffle = await getRatingFromAPI(character, realm, locale, token, `shuffle-${classSpec}`)
        const twos = await getRatingFromAPI(character, realm, locale, token, `2v2`)
        const threes = await getRatingFromAPI(character, realm, locale, token, `3v3`)
        const rbgs = await getRatingFromAPI(character, realm, locale, token, `rbg`)
        const shuffleRank = await specRanking(classSpec, character, token)
        const image = await getImageFromAPI(character, realm, locale, token)
        return { character, realm, locale, twos, threes, rbgs, shuffle, shuffleRank, charClass, charSpec, time: null, image }
    } catch (error) {
        console.error(error)
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