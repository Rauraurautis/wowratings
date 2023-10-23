import { readFromFile } from '@/app/_lib/utils/serverFunctions'
import { NextRequest, NextResponse } from 'next/server'

import { EventNotifier, getSSEWriter } from 'ts-sse'
import { z } from 'zod'

const characterArraySchema = z.string()

export const runtime = 'nodejs';
// This is required to enable streaming
export const dynamic = 'force-dynamic';

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



export async function GET(req: NextRequest, res: Response) {
    try {


        const responseStream = new TransformStream()
        const writer = responseStream.writable.getWriter()
        const encoder = new TextEncoder()
     
            let characters = readFromFile()
            const interval = setInterval(() => {
                const realtimeCharacters = readFromFile()
                if (realtimeCharacters.length > characters.length) {
                    writer.write("SIGNAL")
                }
            }, 1000
            )
        
            req.signal.addEventListener("abort", () => {
                writer.close()
                console.log("Closing connection")
                clearInterval(interval)

            })



        return new NextResponse(responseStream.readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                Connection: 'keep-alive',
                'Cache-Control': 'no-cache, no-transform',
            },
        })
    } catch (error) {
        console.error(error)
        return new NextResponse("ERROR", { status: 400 })
    }
}