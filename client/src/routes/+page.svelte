<script lang="ts">
	import { Username } from '$lib/stores';
	import { onMount } from 'svelte';

	export let data;

	let ws: WebSocket;
	let messages: {
		sender: string;
		message: string;
		timestamp: number;
	}[] = [];
	let inputMessage = '';

	function connect() {
		ws = new WebSocket(`ws://167.99.229.116:3000?username=${$Username}&room=${data.room}`);

		ws.onmessage = function (event) {
			const message = JSON.parse(event.data);
			messages = [...messages, message];
		};

		ws.onclose = function (event) {
			console.log('Disconnected:', event);
		};

		ws.onerror = function (error) {
			console.error('WebSocket Error:', error);
		};
	}

	function sendMessage() {
		if (ws && inputMessage.trim() !== '') {
			messages = [...messages, { sender: $Username, message: inputMessage, timestamp: Date.now() }];
			ws.send(inputMessage);
			inputMessage = '';
		}
	}

	onMount(async () => {
		await new Promise((resolve) => setTimeout(resolve, 200));
		connect();
	});
</script>

<main class="bg-zinc-950 text-zinc-100 w-screen h-screen flex flex-col p-8 gap-8">
	<div class="flex gap-8 text-2xl">
		<p class="font-bold"><span class="text-zinc-500 font-normal">Room:</span> {data.room}</p>
		<p class="font-bold"><span class="text-zinc-500 font-normal">Username:</span> {$Username}</p>
	</div>
	<div class="bg-zinc-950 border border-zinc-900 rounded-lg flex-1 p-4 flex flex-col gap-4">
		{#each messages as message}
			<p>
				<strong class="text-zinc-400">{message.sender}:</strong>
				{message.message}
			</p>
		{/each}
	</div>
	<div class="flex gap-4">
		<input
			bind:value={inputMessage}
			type="text"
			class="flex-1 bg-zinc-900 border border-zinc-800 p-4 rounded-lg"
		/>
		<button
			on:click={sendMessage}
			class="bg-blue-700 border border-blue-600 font-bold text-purple-60 px-8 rounded-lg"
		>
			Send Message
		</button>
	</div>
</main>
