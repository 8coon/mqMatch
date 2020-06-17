
type MQEvent = 'change';
type MQChangeEventHandler = (matches: string[]) => void;

export interface MQMatch {
	/**
	 * Returns the list of current matched queries
	 */
	getCurrentMatches(): string[];

	/**
	 * Adds a new media query to the set
	 * If this query matches, fires <change> event
	 * @param mediaQuery
	 */
	register(mediaQuery: string);

	/**
	 * Removes given media query from the set
	 * If the removed query matched, fires <change> event
	 * @param mediaQuery
	 */
	unregister(mediaQuery: string);

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
	private _queries: Record<string, MediaQueryList> = {};
	private _handlers: MQChangeEventHandler[] = [];

	public getCurrentMatches(): string[] {
		return Object
			.keys(this._queries)
			.filter(query => this._queries[query].matches);
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

	public register(mediaQuery: string) {
		if (this._queries[mediaQuery]) {
			return;
		}

		const query = matchMedia(mediaQuery);

		if (typeof query.addEventListener === 'function') {
			query.addEventListener('change', this._handleMediaQueryChange);
		} else {
			query.addListener(this._handleMediaQueryChange);
		}

		this._queries[mediaQuery] = query;

		if (query.matches) {
			this._handleMediaQueryChange();
		}
	}

	public unregister(mediaQuery: string) {
		if (!this._queries[mediaQuery]) {
			return;
		}

		const query = this._queries[mediaQuery];

		if (typeof query.removeEventListener === 'function') {
			query.removeEventListener('change', this._handleMediaQueryChange);
		} else {
			query.removeListener(this._handleMediaQueryChange);
		}

		delete this._queries[mediaQuery];

		if (query.matches) {
			this._handleMediaQueryChange();
		}
	}

	public destroy() {
		this._handlers.length = 0;

		Object
			.keys(this._queries)
			.forEach(query => this.unregister(query));
	}

	private _handleMediaQueryChange = () => {
		const currentMatches = this.getCurrentMatches();

		for (const handler of this._handlers) {
			handler(currentMatches);
		}
	}
}

export function createMediaQueryMatch(): MQMatch {
	return new MQMatchImpl();
}
