import { readFromFile } from '@/app/_lib/utils/serverFunctions'
import { NextResponse } from 'next/server'

import { EventNotifier, getSSEWriter } from 'ts-sse'
import { z } from 'zod'

export async function GET() {
    const responseStream = new TransformStream()
    const writer = responseStream.writable.getWriter()
    const encoder = new TextEncoder()
    const syncStatusStream = async (notifier: any) => {
        let characters = readFromFile()
        setInterval(() => {

            const characterCheck = readFromFile()
            if (characterCheck.length > characters.length) {
                notifier.update(
                    {
                        data: characterCheck,
                        event: 'update'
                    }
                )
                characters = characterCheck
            }
        }

        ), 1000
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