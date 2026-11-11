import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const script = await readFile(new URL('../app.js', import.meta.url), 'utf8');

function createJourney() {
  const elements = new Map();
  function element(selector) {
    if (!elements.has(selector)) {
      elements.set(selector, {
        dataset: {},
        attributes: {},
        listeners: {},
        textContent: '',
        disabled: false,
        hidden: true,
        classList: { toggle() {} },
        setAttribute(name, value) { this.attributes[name] = value; },
        addEventListener(name, callback) { this.listeners[name] = callback; },
        click() { if (!this.disabled) this.listeners.click(); },
      });
    }
    return elements.get(selector);
  }
  const buttons = Array.from({ length: 5 }, (_, i) => {
    const button = element(`step-${i}`);
    button.dataset.step = String(i);
    return button;
  });
  let tick;
  const document = {
    hidden: false,
    querySelector: element,
    querySelectorAll(selector) {
      return selector === '[data-step]' ? buttons : [element('.journey-controls'), element('.playback')];
    },
    addEventListener(name, callback) { this[name] = callback; },
  };
  runInNewContext(script, {
    document,
    setInterval(callback) { tick = callback; return 1; },
    clearInterval() { tick = undefined; },
  });
  return { element, buttons, document, advance() { tick?.(); } };
}

test('manual stage navigation updates content, accessible selection, and end boundaries', () => {
  const journey = createJourney();
  const get = journey.element;
  for (let i = 0; i < 5; i++) {
    journey.buttons[i].click();
    assert.equal(get('#journey-panel').dataset.stage, String(i));
    assert.equal(get('#previous-step').disabled, i === 0);
    assert.equal(get('#next-step').disabled, i === 4);
    assert.ok(get('#step-description').textContent.length > 50);
    assert.ok(get('#landscape-desc').textContent.length > 20);
    assert.deepEqual(journey.buttons.map((button) => button.attributes['aria-pressed']), journey.buttons.map((_, n) => String(n === i)));
  }
  get('#next-step').click();
  assert.equal(get('#journey-panel').dataset.stage, '4');
  get('#previous-step').click();
  assert.equal(get('#journey-panel').dataset.stage, '3');
  journey.buttons[0].click();
  get('#previous-step').click();
  assert.equal(get('#journey-panel').dataset.stage, '0');
});

test('playback advances, can pause, stops at the last stage, and replays from the beginning', () => {
  const { element: get, buttons, advance } = createJourney();
  buttons[0].click();
  get('#play-journey').click();
  advance();
  assert.equal(get('#journey-panel').dataset.stage, '1');
  get('#play-journey').click();
  advance();
  assert.equal(get('#journey-panel').dataset.stage, '1');
  get('#play-journey').click();
  for (let i = 0; i < 8; i++) advance();
  assert.equal(get('#journey-panel').dataset.stage, '4');
  assert.equal(get('#play-label').textContent, 'Replay the journey');
  get('#play-journey').click();
  assert.equal(get('#journey-panel').dataset.stage, '0');
  advance();
  assert.equal(get('#journey-panel').dataset.stage, '1');
  buttons[3].click();
  advance();
  assert.equal(get('#journey-panel').dataset.stage, '3', 'Manual selection must stop playback');
});

test('switching away from the page pauses playback without losing the current stage', () => {
  const { element: get, buttons, document, advance } = createJourney();
  buttons[2].click();
  get('#play-journey').click();
  document.hidden = true;
  document.visibilitychange();
  advance();
  assert.equal(get('#journey-panel').dataset.stage, '2');
  assert.equal(get('#play-label').textContent, 'Play the journey');
  assert.equal(get('.journey-controls').hidden, false);
  assert.equal(get('.playback').hidden, false);
});
