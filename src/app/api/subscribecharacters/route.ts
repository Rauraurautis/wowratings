import { readFromFile } from '@/app/_lib/utils/serverFunctions'
import { NextResponse } from 'next/server'

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

export async function GET(req: Request, res: Response) {

    const responseStream = new TransformStream()
    const writer = responseStream.writable.getWriter()
    const encoder = new TextEncoder()
    const syncStatusStream = async (notifier: SyncEvents) => {
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

   

    syncStatusStream(getSSEWriter(writer, encoder))

    return new NextResponse(responseStream.readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache, no-transform',
        },
    })
}