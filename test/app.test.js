// Run with: npm test
// Uses Node's built-in test runner, so no extra packages are needed.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../app');

let server;
let baseUrl;

// Start the server on a random free port before the tests run
before(() => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://localhost:${server.address().port}`;
      resolve();
    });
  });
});

after(() => {
  server.close();
});

test('home page serves index.html with the nav bar', async () => {
  const res = await fetch(`${baseUrl}/`);
  assert.strictEqual(res.status, 200);
  const html = await res.text();
  assert.match(html, /<nav class="navbar">/);
});

test('home page has a footer with copyright and GitHub link', async () => {
  const html = await (await fetch(`${baseUrl}/`)).text();
  assert.match(html, /<footer/);
  assert.match(html, /&copy; 2026/);
  assert.match(html, /href="https:\/\/github\.com\//);
});

test('styles.css is served and includes a dark mode scheme', async () => {
  const res = await fetch(`${baseUrl}/styles.css`);
  assert.strictEqual(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/css/);
  assert.match(await res.text(), /prefers-color-scheme: dark/);
});

test('/about returns the about text', async () => {
  const res = await fetch(`${baseUrl}/about`);
  assert.strictEqual(res.status, 200);
  assert.match(await res.text(), /about page/);
});

test('/contact returns the contact text', async () => {
  const res = await fetch(`${baseUrl}/contact`);
  assert.strictEqual(res.status, 200);
  assert.match(await res.text(), /Contact me/);
});

test('/api/time returns a time and a date', async () => {
  const res = await fetch(`${baseUrl}/api/time`);
  const data = await res.json();
  assert.ok(data.time);
  assert.ok(data.date);
});

test('/api/greeting uses the name from the query string', async () => {
  const res = await fetch(`${baseUrl}/api/greeting?name=Tania`);
  const data = await res.json();
  assert.strictEqual(data.message, 'Hello, Tania! Welcome to my server.');
});

test('/api/greeting falls back to "stranger"', async () => {
  const res = await fetch(`${baseUrl}/api/greeting`);
  const data = await res.json();
  assert.strictEqual(data.message, 'Hello, stranger! Welcome to my server.');
});
