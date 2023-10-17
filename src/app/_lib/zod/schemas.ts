import z from "zod"

const regex = /.+-.+/g

const characterSearchSchema = z.object({
    nameRealmCombo: z.string({ required_error: "Provide name and realm for the player!" }).refine(val => regex.test(val)),
    locale: z.string({ required_error: "Provide a locale!" }).refine(val => val === "eu" || val === "us")
})

export { characterSearchSchema }