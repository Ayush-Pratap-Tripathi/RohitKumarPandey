import { createContext, useContext } from 'react'

// true once the film-leader intro has handed over to the page
export const IntroContext = createContext(true)
export const useIntroDone = () => useContext(IntroContext)
