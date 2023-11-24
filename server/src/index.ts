type Message = {
	sender: string
	message: string
	timestamp: number
}

const Rooms: {
	name: string
	messages: Message[]
}[] = []

const server = Bun.serve<{ username: string; room: string }>({
	fetch(req, server) {
		const params = new URL(req.url).searchParams
		const username = params.get('username')
		const room = params.get('room')

		const success = server.upgrade(req, { data: { username, room } })
		if (success) return undefined

		return new Response('You are seeing this because you are not using a websocket client')
	},
	websocket: {
		open(ws) {
			const username = ws.data.username
			const room = ws.data.room

			if (!username || !room) {
				ws.close(4000, 'Missing username or room')
				return
			}

			// Create the room if it doesn't exist
			if (!Rooms.find((r) => r.name === room)) {
				Rooms.push({ name: room, messages: [] })
			}

			ws.subscribe(room)
			ws.publish(
				room,
				JSON.stringify({
					sender: 'SERVER',
					message: `${username} has joined the chat!`,
					timestamp: Date.now(),
				})
			)
		},
		message(ws, message) {
			const room = ws.data.room
			if (!room) return

			const username = ws.data.username
			if (!username) return

			const msg: Message = {
				sender: username,
				message: message.toString(),
				timestamp: Date.now(),
			}

			Rooms.find((r) => r.name === room)?.messages.push(msg)
			ws.publish(room, JSON.stringify(msg))
		},
		close(ws) {
			const username = ws.data.username
			const room = ws.data.room

			if (!username || !room) return

			ws.publish(
				room,
				JSON.stringify({
					sender: 'SERVER',
					message: `${username} has left the chat!`,
					timestamp: Date.now(),
				})
			)
		},
	},
})

console.log(`Listening on ${server.hostname}:${server.port}`)
