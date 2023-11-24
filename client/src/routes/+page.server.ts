export const load = async ({ url }) => {
	const room = url.href.split('://')[1].split('.chat')[0];

	return {
		room
	};
};
