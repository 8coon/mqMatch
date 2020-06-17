import {alter, setup, teardown} from "./mocks/matchMedia.modern";
import {createMediaQueryMatch, MQMatch} from "../src";

describe('[modern] Unit', () => {
	let mqMatch: MQMatch;

	beforeAll(() => {
		setup();
		mqMatch = createMediaQueryMatch();
	});

	afterEach(() => {
		alter([]);
	});

	afterAll(() => {
		mqMatch.destroy();
		teardown();
	});

	test('Matches one query', () => {
		mqMatch = createMediaQueryMatch();
		expect(mqMatch.getCurrentMatches()).toEqual([]);

		mqMatch.register('(min-height: 220)');
		alter(['(min-height: 220)']);

		expect(mqMatch.getCurrentMatches()).toEqual(['(min-height: 220)']);

		alter([]);
		expect(mqMatch.getCurrentMatches()).toEqual([]);
	});

	test('triggers events on matched query list change', () => {
		mqMatch = createMediaQueryMatch();
		const handler = jest.fn();

		mqMatch.on('change', handler);

		mqMatch.register('(min-height: 220)');
		alter(['(min-height: 220)']);

		alter([]);
		mqMatch.unregister('(min-height: 220)');

		alter(['(min-height: 220)']);
		mqMatch.register('(min-height: 220)');

		expect(handler.mock.calls).toMatchSnapshot();
	});
});
