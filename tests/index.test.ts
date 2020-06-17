import {Browser, Page, chromium, firefox, webkit} from "playwright";
import {Server} from "http";
import {createServer} from "http-server";
import path from "path";

jest.setTimeout(30000);

let server: Server;

beforeAll(() => {
	server = createServer({root: path.resolve(__dirname, "../")});
	server.listen(8080);
});

afterAll(() => {
	server.close();
});

[chromium, firefox, webkit].forEach(engine => {
	describe('Integration',  () => {
		let browser: Browser;
		let page: Page;

		beforeAll(async () => {
			browser = await engine.launch();
		});

		beforeEach(async () => {
			page = await browser.newPage();
		});

		afterEach(async () => {
			await page.close();
		});

		afterAll(async () => {
			await browser.close();
		});

		test(`Test ${engine.name()}`, async () => {
			await page.setViewportSize({width: 500, height: 300});

			await page.goto('http://localhost:8080/tests/integration');

			await page.waitForSelector('#loaded', {state: 'visible'});

			await page.waitForSelector('#query1', {state: 'hidden'});
			await page.waitForSelector('#query2', {state: 'hidden'});
			await page.waitForSelector('#query3', {state: 'hidden'});

			await page.setViewportSize({width: 600, height: 300});

			await page.waitForSelector('#query1', {state: 'visible'});
			await page.waitForSelector('#query2', {state: 'hidden'});
			await page.waitForSelector('#query3', {state: 'hidden'});

			await page.setViewportSize({width: 700, height: 300});

			await page.waitForSelector('#query1', {state: 'hidden'});
			await page.waitForSelector('#query2', {state: 'visible'});
			await page.waitForSelector('#query3', {state: 'visible'});

			await page.setViewportSize({width: 750, height: 300});

			await page.waitForSelector('#query1', {state: 'hidden'});
			await page.waitForSelector('#query2', {state: 'visible'});
			await page.waitForSelector('#query3', {state: 'hidden'});
		});
	});
});
