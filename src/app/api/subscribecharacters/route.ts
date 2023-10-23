import { readFromFile } from '@/app/_lib/utils/serverFunctions'
import EventEmitter from 'events'
import { NextRequest, NextResponse } from 'next/server'

import { EventNotifier, getSSEWriter } from 'ts-sse'
import { z } from 'zod'

const characterArraySchema = z.string()

export const dynamic = 'force-dynamic'

type SyncEvents = EventNotifier<{
    update: {
        data: z.infer<typeof characterArraySchema>,
        event: 'update'
    }
    complete: {
        data: z.infer<typeof characterArraySchema>
        event: 'update'
    }
    close: {
        data: never
    }
    error: {
        data: never
    }
}>

const stream = new EventEmitter()

export async function GET(req: NextRequest, res: NextResponse) {
    try {


        const responseStream = new TransformStream()
        const writer = responseStream.writable.getWriter()
        const encoder = new TextEncoder()
        /*const syncStatusStream = async (notifier: SyncEvents) => {
            let characters = readFromFile()
            setInterval(() => {
                const characterCheck = readFromFile()
                if (characterCheck.length > characters.length) {
                    notifier.update(
                        {
                            data: "REFETCH!",
                            event: 'update'
                        }
                    )
                    characters = characterCheck
                }
            }, 1000
            )
        }

         await syncStatusStream(getSSEWriter(writer, encoder)) */



        stream.on("channel", () => {
            writer.write(`data: SIGNAL\n\n`)
        })

        let characters = readFromFile()

        const interval = setInterval(() => {
            const characterCheck = readFromFile()
            if (characterCheck.length > characters.length) {
                writer.write(`data: SIGNAL\n\n`)
            }
        }, 1000)

        req.signal.addEventListener("abort", async () => {
            clearInterval(interval)
            await writer.close()

        })

        return new NextResponse(responseStream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                Connection: 'keep-alive',
                'Cache-Control': 'no-cache, no-transform',
            }
        })

    } catch (error) {
        console.error(error)
        return new NextResponse("closed", {
            headers: {
                Connection: 'close',

            }
        })
    }
}