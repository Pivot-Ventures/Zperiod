import test from "node:test";
import assert from "node:assert/strict";

import {
  ACE_LAB_EXPERIMENTS,
  ACE_LAB_LEVELS,
  experimentsForLevel,
  titrationState,
} from "../js/modules/virtualLabExperiments.js";

test("every lab level has guided practicals", () => {
  for (const level of ACE_LAB_LEVELS) {
    assert.ok(experimentsForLevel(level.id).length > 0, `${level.label} has no experiments`);
  }
});

test("level 11 includes multiple quantitative titrations", () => {
  const titrations = experimentsForLevel("11").filter((experiment) => experiment.kind === "titration");
  assert.ok(titrations.length >= 3);
});

test("strong acid and base endpoint is 25.00 mL", () => {
  const experiment = ACE_LAB_EXPERIMENTS.find((row) => row.id === "hcl-naoh");
  const state = titrationState(experiment, 25);
  assert.equal(state.endpointMl, 25);
  assert.equal(state.atEndpoint, true);
  assert.equal(state.pastEndpoint, false);
});

test("diprotic acid uses acid equivalents", () => {
  const experiment = ACE_LAB_EXPERIMENTS.find((row) => row.id === "sulfuric-naoh");
  assert.equal(titrationState(experiment, 25).endpointMl, 25);
});

test("phenolphthalein changes only around the endpoint", () => {
  const experiment = ACE_LAB_EXPERIMENTS.find((row) => row.id === "hcl-naoh");
  assert.equal(titrationState(experiment, 20).color, "#f8fafc");
  assert.equal(titrationState(experiment, 25).color, "#f9c5df");
  assert.equal(titrationState(experiment, 27).color, "#ec4899");
});
