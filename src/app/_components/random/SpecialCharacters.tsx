"use client"
import { Dispatch, FC, SetStateAction } from 'react'
import { CharInfoProps } from '../characters/SearchWithAutocomplete'

interface SpecialCharacterProps {
    setCharInfo: Dispatch<SetStateAction<CharInfoProps>>
}

const specialLetters = ["Ç", "ü", "é", "â", "ä", "à", "å", "ç",
    "ê", "ë", "è", "ï", "î", "ì", "æ", "Æ", "ô", "ö", "ò", "û", "ù", "ÿ", "¢", "ƒ", "á", "í", "ó", "ú",
    "ñ", "Ñ", "ß", "µ", "Š", "š", "œ", "Ÿ",
    "À", "Á", "Â", "Ã", "Ä", "Å", "È", "É", "Ê", "Ë", "Ì", "Í", "Î", "Ï", "Ð", "Ò", "Ó", "Ô", "Õ",
    "Ö", "Ø", "Ù", "Ú", "Û", "Ü", "Ý", "Þ", "ã", "ð", "õ", "ø", "ü", "ý", "þ"
]


const SpecialCharacters: FC<SpecialCharacterProps> = ({ setCharInfo }) => {

    return <>
        {specialLetters.map((key, i) => (
            <div className="w-[25px] h-[25px] bg-black hover:bg-gray-800 rounded-md text-white flex justify-center items-center text-lg cursor-pointer hover:bg-gray-200" key={i} onClick={() => setCharInfo(prev => ({ ...prev, nameRealmCombo: prev.nameRealmCombo + key }))}>{key}</div>
        ))}
    </>
}

export default SpecialCharacters