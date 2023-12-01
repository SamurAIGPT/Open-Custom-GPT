'use client'
import { createContext,useState } from "react"

const keyDefault = {
    key: '',
    setKey: () => {}
}
export const KeyContext = createContext(keyDefault);

function MainComponent({children}) {
    const [key,setKey] = useState("")
    return(
        <KeyContext.Provider value={{key,setKey}}>
            {children}
        </KeyContext.Provider>
    )
}
export default MainComponent