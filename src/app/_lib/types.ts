export type ArenaData = {
    twos: number | null
    threes: number | null
    rbgs: number | null
    shuffle: number | null
    shuffleRank: number | null
}

export type HighestRatings = {
    highestThrees: number
    highestTwos: number
    highestRbg: number
}

export type FullCharacterData = {
    id: number
    character: string
    realm: string
    locale: string
    charSpec: string
    charClass: string
    time: number | null
    image: string
    highestRatings: HighestRatings
} & ArenaData

