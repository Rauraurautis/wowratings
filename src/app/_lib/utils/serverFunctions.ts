"use server"
import fs from "fs"
import { FullCharacterData } from "../types"

const addCharacter = async (data: FullCharacterData) => {
    try {
        const file = fs.readFileSync(process.env.CHAR_FILE)
        const characters: FullCharacterData[] = JSON.parse(file.toString())

        // Checks if character exists in the array, updates it if does, adds if it doesnt
        const index = characters.findIndex(char => char.character === data.character)
        console.log(index)
        if (index !== -1) {
            characters.splice(index, 1)
            characters.unshift({ ...data, time: new Date().getTime() })
        } else {
            characters.unshift({ ...data, time: new Date().getTime() })
        }
        fs.writeFileSync(process.env.CHAR_FILE, JSON.stringify(characters))
        return data
    } catch (error) {
        console.error(error)
    }
}

const readFromFile = (): FullCharacterData[] => {
    const fileData = fs.readFileSync(process.env.CHAR_FILE as string)
    return JSON.parse(fileData.toString())
}

export { addCharacter, readFromFile }