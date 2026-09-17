import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("closing a tool modal tears down the active interaction", () => {
  const controller = read("js/modules/toolsModalController.js");
  assert.match(controller, /cleanupToolEventListeners\(activeToolType\)/);
  assert.match(controller, /requestToken !== openRequestToken \|\| activeToolType !== toolType/);
});

test("Virtual Lab cleanup cancels every long-running resource", () => {
  const interactions = read("js/modules/chemToolInteractions.js");
  const cleanupAt = interactions.indexOf("virtualLabCleanup = () =>");
  assert.ok(cleanupAt > 0);
  const cleanup = interactions.slice(cleanupAt, cleanupAt + 1000);
  assert.match(cleanup, /stopAutoTitration\(\)/);
  assert.match(cleanup, /controller\.abort\(\)/);
  assert.match(cleanup, /cancelAnimationFrame/);
  assert.match(cleanup, /MatterLib\.Engine\.clear/);
});

test("application passes cleanup into the modal controller", () => {
  const app = read("script.js");
  assert.match(app, /createToolsModalController\(\{[\s\S]*cleanupToolEventListeners/);
});
