import { addOrUpdateCharacter } from "@/app/_lib/utils/arenaDataFunctions";
import { readFromFile } from "@/app/_lib/utils/serverFunctions";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, res: NextResponse) {
    const characters = readFromFile()
    return NextResponse.json(characters.slice(0, 10))
}

export async function POST(req: NextRequest, res: NextResponse) {
    const postData = await req.json()
    const { name, realm, locale } = postData
    const char = await addOrUpdateCharacter(name, realm, locale)
    return NextResponse.json(char, { status: 200 })
}