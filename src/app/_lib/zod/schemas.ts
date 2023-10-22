import z from "zod"

const regex = /.+-.+/

const characterSearchSchema = z.object({
    nameRealmCombo: z.string({ required_error: "Provide name and realm for the player!" })
        .regex(new RegExp(regex), "Name and realm combo should be in NAME-REALM format!")
    ,
    locale: z.string({ required_error: "Provide a locale!" }).refine(val => val === "eu" || val === "us")
})

export { characterSearchSchema }