export default {
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname === '/api/ping') {
      return Response.json({ message: 'pong' })
    }

    return new Response('Not found', { status: 404 })
  },
} satisfies ExportedHandler<Env>
