import {setup as setupModern} from "./matchMedia.modern";
export {alter, teardown} from "./matchMedia.modern";

export function setup(matchingQueries?: string[]) {
	setupModern(matchingQueries);

	const matchMediaModern = window.matchMedia;

	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: jest.fn().mockImplementation(query => {
			const result = matchMediaModern(query);

			delete result.addListener;
			delete result.removeListener;

			return result;
		}),
	});
}
