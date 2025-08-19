import 'unplugin-icons/types/svelte';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: import('./hooks.server').AuthHandler;
		}
		namespace Superforms {
			type Message = {
				type: 'error' | 'success';
				text: string;
			};
		}
	} // interface Error {}
	// interface Locals {}
} // interface PageData {}
// interface PageState {}

// interface Platform {}
export {};
