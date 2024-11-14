import { atom } from "jotai"

export const dashboardSelectedAtom = atom<string>("")
export const grafanaServerResourceParamAtom = atom<string>("")
export const grafanaServerProcessParamAtom = atom<string>("")

export const grafanaThemeAtom = atom<"dark" | "light">("dark")
