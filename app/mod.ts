import { route, use, listen } from './koa/mod.ts'

route('/api/product/:pid', req => {
  req.respond({
    body: JSON.stringify(req.params)
  })
})

route('/api/user/info', req => {
  req.respond({
    body: JSON.stringify({
      name: 'deno'
    })
  })
})

route('POST', '/login', req => {
  req.respond({
    body: JSON.stringify({
      message: 'success'
    })
  })
})

use(req => {
  req.respond({ body: "Hello World\n" })
})

listen({ port: 7300 }, () => {
  console.log('Listen on http://127.0.0.1:7300')
})
