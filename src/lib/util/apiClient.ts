export default async function apiRequest(
	method: string,
	url: string,
	data?: any | FormData,
	init?: RequestInit
): Promise<any> {
	const res = await fetch(url, {
		method,
		headers: data && !(data instanceof FormData) ? { 'Content-Type': 'application/json' } : {},
		body: data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
		...init
	});

	if (res.ok) return await res.json();
	else {
		let message = res.statusText || 'An error occurred';
		try {
			message = (await res.json()).message;
		} catch {}
		throw new Error(message);
	}
}
