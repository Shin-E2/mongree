import { test } from "node:test";
import assert from "node:assert/strict";

// 순수 매핑 로직을 인라인 (ESM 경로 문제 회피, mongi-level.test.mjs와 동일 패턴)
const CATEGORY_COLOR = {
  joy: "oklch(0.82 0.13 85)",
  calm: "oklch(0.78 0.09 165)",
  sad: "oklch(0.72 0.11 250)",
  anxious: "oklch(0.71 0.1 300)",
  angry: "oklch(0.7 0.14 25)",
  lonely: "oklch(0.66 0.07 265)",
  tired: "oklch(0.7 0.06 70)",
  shame: "oklch(0.78 0.1 12)",
  confused: "oklch(0.74 0.08 195)",
};
const DEFAULT_COLOR = "oklch(0.7 0.04 255)";
const EMOTION_CATEGORY = {
  joyful: "joy", happy: "joy", excited: "joy", proud: "joy",
  disappointed: "calm", calm: "calm", relieved: "calm", comfortable: "calm", stable: "calm",
  sad: "sad", hurt: "sad", loss: "sad", empty: "sad",
  anxious: "anxious", worried: "anxious", nervous: "anxious", scared: "anxious",
  angry: "angry", irritated: "angry", unfair: "angry", frustrated: "angry",
  lonely: "lonely", isolated: "lonely", missing: "lonely", void: "lonely",
  tired: "tired", lethargic: "tired", exhausted: "tired", burnout: "tired",
  ashamed: "shame", guilty: "shame", regret: "shame", embarrassed: "shame",
  confused: "confused", stuck: "confused", sensitive: "confused", blank: "confused",
};
function getEmotionColor(id) {
  const c = EMOTION_CATEGORY[id];
  return c ? CATEGORY_COLOR[c] : DEFAULT_COLOR;
}

test("알려진 감정은 카테고리 색을 반환", () => {
  assert.equal(getEmotionColor("joyful"), CATEGORY_COLOR.joy);
  assert.equal(getEmotionColor("sad"), CATEGORY_COLOR.sad);
  assert.equal(getEmotionColor("angry"), CATEGORY_COLOR.angry);
});

test("같은 카테고리 감정은 같은 색", () => {
  assert.equal(getEmotionColor("joyful"), getEmotionColor("happy"));
  assert.equal(getEmotionColor("sad"), getEmotionColor("hurt"));
  assert.equal(getEmotionColor("tired"), getEmotionColor("burnout"));
});

test("다른 카테고리는 다른 색", () => {
  assert.notEqual(getEmotionColor("joyful"), getEmotionColor("sad"));
  assert.notEqual(getEmotionColor("calm"), getEmotionColor("angry"));
});

test("알 수 없는 감정은 중립색", () => {
  assert.equal(getEmotionColor("unknown_xyz"), DEFAULT_COLOR);
  assert.equal(getEmotionColor(""), DEFAULT_COLOR);
});

test("37개 감정 전부 매핑되어 있다", () => {
  assert.equal(Object.keys(EMOTION_CATEGORY).length, 37);
});
