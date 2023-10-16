
import { FC } from 'react'
import SearchWithAutocomplete from '../_components/characters/SearchWithAutocomplete'
import { FullCharacterData } from '../_lib/types'

import { onValue, ref, set, get, child } from "firebase/database"
import axios from 'axios'
import { getAccessToken } from '../_lib/firebase'




const About: FC = async ({ }) => {
 
  const accesToken = await getAccessToken()
  console.log(accesToken)


  return <div>
    <button>adsd</button>
  </div>
}

export default About