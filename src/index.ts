
type MQEvent = 'change';
type MQChangeEventHandler = (matches: string[]) => void;

export interface MQMatchSnapshotRecord {
	raw: string;
	parsed: string;
	matches: boolean;
}

interface QueryRecord {
	value: string;
	query: MediaQueryList;
}

export interface MQMatch {
	/**
	 * Returns the list of current matched queries
	 */
	getCurrentMatches(): string[];

	/**
	 * Returns the current listeners state
	 */
	getCurrentSnapshot(): MQMatchSnapshotRecord[];

	/**
	 * Adds a new media query to the set
	 * If this query matches, fires <change> event
	 * @param mediaQuery
	 */
	register(mediaQuery: string);
	register(key: string, mediaQuery: string);

	/**
	 * Removes given media query from the set
	 * If the removed query matched, fires <change> event
	 * @param key
	 */
	unregister(key: string);

	/**
	 * Subscribes to an event
	 * @param event
	 * @param handler
	 */
	on(event: MQEvent, handler: MQChangeEventHandler);

	/**
	 * Unsubscribes from an event
	 * @param event
	 * @param handler
	 */
	off(event: MQEvent, handler: MQChangeEventHandler);

	/**
	 * Destroys this matcher instance and all its query listeners
	 */
	destroy();
}

class MQMatchImpl implements MQMatch {
	private _queries: Record<string, QueryRecord> = {};
	private _handlers: MQChangeEventHandler[] = [];
	private _lastFiredSnapshot: string;
	private _hackStyleEl: HTMLStyleElement;

	public getCurrentMatches(): string[] {
		return Object
			.keys(this._queries)
			.filter(query => this._queries[query].query.matches)
			.sort();
	}

	public getCurrentSnapshot(): MQMatchSnapshotRecord[] {
		return Object
			.keys(this._queries)
			.map(query => ({
				key: query,
				raw: this._queries[query].value,
				parsed: this._queries[query].query.media,
				matches: this._queries[query].query.matches,
			}));
	}

	public on(event: MQEvent, handler: MQChangeEventHandler) {
		if (event !== 'change') {
			return;
		}

		if (this._handlers.indexOf(handler) === -1) {
			this._handlers.push(handler);
		}
	}

	public off(event: MQEvent, handler: MQChangeEventHandler) {
		if (event !== 'change') {
			return;
		}

		const index = this._handlers.indexOf(handler);

		if (index !== -1) {
			this._handlers.splice(index, 1);
		}
	}

	public register(mediaQuery: string)
	public register(key: string, mediaQuery: string)
	public register(key: string, mediaQuery?: string) {
		if (mediaQuery === undefined) {
			mediaQuery = key;
		}

		if (this._queries[key]) {
			return;
		}

		const query = matchMedia(mediaQuery);

		if (typeof query.addEventListener === 'function') {
			query.addEventListener('change', this._handleMediaQueryChange);
		} else {
			query.addListener(this._handleMediaQueryChange);
		}

		this._queries[key] = {
			value: mediaQuery,
			query,
		};

		if (query.matches) {
			this._handleMediaQueryChange();
		}
	}

	public unregister(key: string) {
		if (!this._queries[key]) {
			return;
		}

		const query = this._queries[key].query;

		if (typeof query.removeEventListener === 'function') {
			query.removeEventListener('change', this._handleMediaQueryChange);
		} else {
			query.removeListener(this._handleMediaQueryChange);
		}

		delete this._queries[key];

		if (query.matches) {
			this._handleMediaQueryChange();
		}
	}

	public destroy() {
		this._handlers.length = 0;

		Object
			.keys(this._queries)
			.forEach(key => this.unregister(key));
	}

	private _handleMediaQueryChange = () => {
		const currentMatches = this.getCurrentMatches();

		const currentMatchesSnapshot = currentMatches.join(',');

		if (this._lastFiredSnapshot !== undefined && this._lastFiredSnapshot === currentMatchesSnapshot) {
			return;
		}

		this._lastFiredSnapshot = currentMatchesSnapshot;

		for (const handler of this._handlers) {
			handler(currentMatches);
		}
	}
}

export function createMediaQueryMatch(): MQMatch {
	return new MQMatchImpl();
}
