export type StageId = 'slot' | 'roulette' | 'garagara';
export type PrizeTier = 'special' | 'standard' | 'try';

export interface StageCopy {
  label: string;
  title: string;
  description: string;
  instruction: string;
  coinCta: string;
  cta: string;
  resultHeading: string;
}

export interface HeroCopy {
  eyebrow: string;
  title: string;
  description: string;
  note: string;
}

export interface EditableContent {
  hero: HeroCopy;
  stages: Record<StageId, StageCopy>;
  prizeMessages: Record<PrizeTier, string>;
}

export interface Prize {
  id: PrizeTier;
  label: string;
  shortLabel: string;
  color: string;
  chance: number;
}
