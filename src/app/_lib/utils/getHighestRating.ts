import { FullCharacterData } from "../types"

const ladderHumanization = {
    shuffle: "Shuffle",
    threes: "3v3",
    twos: "2v2",
    rbgs: "RBG"
}

type LadderHumanizationKeys = typeof ladderHumanization


const getHighestRating = (character: FullCharacterData) => {
    const highest = Math.max(character.rbgs || 0, character.shuffle || 0, character.threes || 0, character.twos || 0)
    const ladder = Object.keys(character).find(entry => {
        return character[entry as keyof FullCharacterData] === highest
    })
    if (highest === 0) return "No rating"
    return `${ladderHumanization[ladder as keyof LadderHumanizationKeys]}: ${highest}`
}

export default getHighestRating