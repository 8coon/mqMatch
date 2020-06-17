import {EventEmitter} from "events";

interface MQLMock extends MediaQueryList {
	matches: boolean;
	__emitter: EventEmitter;
}

let globalMatchingQueries: string[] = [];
let mqls: MQLMock[] = [];

export function setup(matchingQueries?: string[]) {
	if (matchingQueries) {
		globalMatchingQueries = matchingQueries;
	}

	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: jest.fn().mockImplementation(query => {
			const emitter = new EventEmitter();

			const mql = {
				matches: globalMatchingQueries.includes(query),
				media: query,
				onchange: null,
				addListener: (listener) => {emitter.on('change', listener)},
				removeListener: (listener) => {emitter.off('change', listener)}, // deprecated
				addEventListener: (name, listener) => {emitter.on(name, listener)},
				removeEventListener: (name, listener) => {emitter.off(name, listener)},
				dispatchEvent: () => undefined,
				__emitter: emitter,
			};

			mqls.push(mql);
			return mql;
		}),
	});
}

export function alter(matchingQueries: string[]) {
	globalMatchingQueries = matchingQueries;

	const toFire: MQLMock[] = [];

	for (const mql of mqls) {
		const matches = globalMatchingQueries.includes(mql.media);
		const matchesChanged = mql.matches !== matches;

		mql.matches = matches;

		if (matchesChanged) {
			toFire.push(mql);
		}
	}

	for (const mql of toFire) {
		mql.__emitter.emit('change');
	}
}

export function teardown() {
	delete window['matchMedia'];
	mqls = [];
}
