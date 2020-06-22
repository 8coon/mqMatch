import {alter, setup, teardown} from "./mocks/matchMedia.modern";
import {setup as setupLegacy} from "./mocks/matchMedia.legacy";
import {createMediaQueryMatch, MQMatch} from "../src";

describe('Unit', () => {
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

	test('multiple queries match at once', () => {
		mqMatch = createMediaQueryMatch();
		const handler = jest.fn();

		mqMatch.on('change', handler);

		mqMatch.register('(min-height: 220)');
		mqMatch.register('(min-height: 440)');

		alter([]);
		alter(['(min-height: 220)']);
		alter(['(min-height: 440)']);
		alter(['(min-height: 220)', '(min-height: 440)']);

		expect(handler.mock.calls).toMatchSnapshot();
	});

	test('on and off works', () => {
		mqMatch = createMediaQueryMatch();
		const handler = jest.fn();

		alter(['(min-height: 220)']);

		mqMatch.on('change', handler);
		mqMatch.on('change', handler);

		mqMatch.register('(min-height: 220)');

		mqMatch.off('change', handler);
		alter([]);

		mqMatch.on('change', handler);
		alter(['(min-height: 220)']);

		mqMatch.off('change', handler);
		mqMatch.off('change', handler);
		alter([]);

		mqMatch.on('change2' as any, handler);
		alter(['(min-height: 220)']);
		mqMatch.off('change2' as any, handler);

		expect(handler.mock.calls).toMatchSnapshot();
	});

	test('register and unregister work', () => {
		mqMatch = createMediaQueryMatch();
		const handler = jest.fn();

		mqMatch.on('change', handler);
		alter(['(min-height: 220)']);

		mqMatch.register('(min-height: 220)');
		mqMatch.register('(min-height: 220)');

		mqMatch.unregister('(min-height: 220)');
		mqMatch.unregister('(min-height: 220)');

		expect(handler.mock.calls).toMatchSnapshot();
	});

	test('destroy works', () => {
		mqMatch = createMediaQueryMatch();
		const handler = jest.fn();

		mqMatch.register('(min-height: 220)');
		mqMatch.on('change', handler);

		mqMatch.destroy();

		alter(['(min-height: 220)']);

		expect(handler.mock.calls).toEqual([]);
	});

	test('works with deprecated methods', () => {
		setupLegacy();

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

	test('returns correct snapshot', () => {
		mqMatch = createMediaQueryMatch();
		expect(mqMatch.getCurrentSnapshot()).toMatchSnapshot();

		mqMatch.register('(min-height: 220)');
		alter(['(min-height: 220)']);
		expect(mqMatch.getCurrentSnapshot()).toMatchSnapshot();

		alter([]);
		expect(mqMatch.getCurrentSnapshot()).toMatchSnapshot();
	});

	test('returns sorted keys', () => {
		mqMatch = createMediaQueryMatch();

		mqMatch.register('B', '(min-height: 220)');
		mqMatch.register('A', '(min-height: 230)');
		mqMatch.register('C', '(min-height: 240)');

		alter(['(min-height: 220)', '(min-height: 230)', '(min-height: 240)']);

		expect(mqMatch.getCurrentMatches()).toEqual(['A', 'B', 'C']);
	});
});
