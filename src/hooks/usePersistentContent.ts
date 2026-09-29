import { useEffect, useState } from 'react';
import { DEFAULT_CONTENT } from '../content/stageContent';
import type { EditableContent, HeroCopy, PrizeTier, StageCopy } from '../types';

const STORAGE_KEY = 'lucky-stage-three-types-content-v5';
const LEGACY_V4_STORAGE_KEY = 'lucky-stage-two-types-content-v4';
const LEGACY_V3_STORAGE_KEY = 'lucky-stage-two-types-content-v3';

type UnknownRecord = Record<string, unknown>;

const PREVIOUS_V4_HERO: HeroCopy = {
  eyebrow: 'TWO WAYS TO PLAY',
  title: '選べる、\n2つの運試し。',
  description: '高速スロットと、回転するルーレット。\n今夜の気分で、好きなステージを選んでください。',
  note: 'デモ体験です / 実際の決済は行われません',
};

function cloneDefault(): EditableContent {
  return JSON.parse(JSON.stringify(DEFAULT_CONTENT)) as EditableContent;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readStorage(key: string): UnknownRecord | null {
  try {
    const raw = window.localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function mergeTextFields<T extends object>(base: T, candidate: unknown): T {
  if (!isRecord(candidate)) return base;
  const merged = { ...base };
  for (const key of Object.keys(base) as Array<keyof T>) {
    const value = candidate[String(key)];
    if (typeof value === 'string') merged[key] = value as T[keyof T];
  }
  return merged;
}

function hasSameTextFields(candidate: unknown, expected: HeroCopy): boolean {
  if (!isRecord(candidate)) return false;
  return (Object.keys(expected) as Array<keyof HeroCopy>).every((key) => candidate[String(key)] === expected[key]);
}

function mergeAllStages(saved: UnknownRecord): EditableContent {
  const stages = isRecord(saved.stages) ? saved.stages : {};
  return {
    hero: mergeTextFields<HeroCopy>(cloneDefault().hero, saved.hero),
    stages: {
      slot: mergeTextFields<StageCopy>(cloneDefault().stages.slot, stages.slot),
      roulette: mergeTextFields<StageCopy>(cloneDefault().stages.roulette, stages.roulette),
      garagara: mergeTextFields<StageCopy>(cloneDefault().stages.garagara, stages.garagara),
    },
    prizeMessages: mergeTextFields<Record<PrizeTier, string>>(cloneDefault().prizeMessages, saved.prizeMessages),
  };
}

function migrateV4Content(saved: UnknownRecord): EditableContent {
  const stages = isRecord(saved.stages) ? saved.stages : {};
  return {
    hero: hasSameTextFields(saved.hero, PREVIOUS_V4_HERO) ? cloneDefault().hero : mergeTextFields<HeroCopy>(cloneDefault().hero, saved.hero),
    stages: {
      slot: mergeTextFields<StageCopy>(cloneDefault().stages.slot, stages.slot),
      roulette: mergeTextFields<StageCopy>(cloneDefault().stages.roulette, stages.roulette),
      garagara: cloneDefault().stages.garagara,
    },
    prizeMessages: mergeTextFields<Record<PrizeTier, string>>(cloneDefault().prizeMessages, saved.prizeMessages),
  };
}

function migrateV3Content(saved: UnknownRecord): EditableContent {
  const stages = isRecord(saved.stages) ? saved.stages : {};
  return {
    ...cloneDefault(),
    stages: {
      ...cloneDefault().stages,
      slot: mergeTextFields<StageCopy>(cloneDefault().stages.slot, stages.slot),
    },
    prizeMessages: mergeTextFields<Record<PrizeTier, string>>(cloneDefault().prizeMessages, saved.prizeMessages),
  };
}

function loadContent(): EditableContent {
  const current = readStorage(STORAGE_KEY);
  if (current) return mergeAllStages(current);
  const v4 = readStorage(LEGACY_V4_STORAGE_KEY);
  if (v4) return migrateV4Content(v4);
  const v3 = readStorage(LEGACY_V3_STORAGE_KEY);
  return v3 ? migrateV3Content(v3) : cloneDefault();
}

export function usePersistentContent() {
  const [content, setContent] = useState<EditableContent>(loadContent);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  return { content, setContent, resetContent: () => setContent(cloneDefault()) };
}
