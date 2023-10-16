import { create } from "zustand";
import { FullCharacterData } from "../types";

type CharacterStoreProps = {
    selectedCharacter: FullCharacterData | null
    setCharacter: (data: FullCharacterData) => void
}

const useCharacterStore = create<CharacterStoreProps>((set) => ({
    selectedCharacter: null,
    setCharacter: (character: FullCharacterData) => {
        set(state => ({
            ...state, selectedCharacter: character
        }))
    }
}))

export default useCharacterStore