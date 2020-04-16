import { serve, HTTPOptions, Server } from "https://deno.land/std/http/server.ts";

import { SeriesTaskHandler, runTasks } from './lib/tasks.ts'

export type RequestHandler = SeriesTaskHandler<any>

const callbacks: RequestHandler[] = []

export function use(fn: RequestHandler): void {
  callbacks.push(fn)
}

export async function listen(addr: string | HTTPOptions, callback?: (s: Server) => void): Promise<void> {
  const s = serve(addr);

  if (typeof callback === 'function') {
    callback(s)
  }

  for await (const req of s) {
    await runTasks(callbacks, req)
  }
}
