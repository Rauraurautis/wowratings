"use server"
import fs from "fs"
import { FullCharacterData } from "../types"

const addCharacter = async (data: FullCharacterData) => {
    try {
        const file = fs.readFileSync(process.env.CHAR_FILE)

        const fileData = `[${file.toString().split("|").join(",").replaceAll("\\n", "")}]`

        const characters: FullCharacterData[] = file.toString().length === 0 ? [] : JSON.parse(fileData)


        // Checks if character exists in the array, updates it if does, adds if it doesnt
        const index = characters.findIndex(char => char.id === data.id)
        data = { ...data, time: new Date().getTime() }
        if (index !== -1) {
            characters.splice(index, 1)
            characters.unshift(data)
        } else {
            characters.unshift(data)
        }

        fs.writeFileSync(process.env.CHAR_FILE, "")
        characters.forEach((char, i) => {
            if (i === characters.length - 1) {
                fs.appendFileSync(process.env.CHAR_FILE, `${JSON.stringify(char)}`)
            } else {
                fs.appendFileSync(process.env.CHAR_FILE, `${JSON.stringify(char)}|\n`)
            }

        })

        return data
    } catch (error) {
        console.error(error)
    }
}

const readFromFile = (): FullCharacterData[] => {
    const file = fs.readFileSync(process.env.CHAR_FILE as string)
    const fileData = `[${file.toString().split("|").join(",").replaceAll("\\n", "")}]`

    return JSON.parse(fileData)
}

export { addCharacter, readFromFile }