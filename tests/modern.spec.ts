import {alter, setup, teardown} from "./mocks/matchMedia.modern";
import {createMediaQueryMatch} from "../src";

describe('[modern] Unit', () => {
	beforeAll(() => {
		setup();
	});

	afterEach(() => {
		alter([]);
	});

	afterAll(() => {
		teardown();
	});

	test('Matches one query', () => {
		const mqMatch = createMediaQueryMatch();
		expect(mqMatch.getCurrentMatches()).toEqual([]);

		mqMatch.register('(min-height: 220)');
		alter(['(min-height: 220)']);

		expect(mqMatch.getCurrentMatches()).toEqual(['(min-height: 220)']);

		alter([]);
		expect(mqMatch.getCurrentMatches()).toEqual([]);
	});
});
