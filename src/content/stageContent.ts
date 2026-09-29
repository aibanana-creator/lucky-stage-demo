import type { EditableContent, Prize, PrizeTier } from '../types';

export const ASSET_URLS = {
  slot: '/images/slot-hero-3a6927d6.webp',
  rouletteHero: '/images/roulette-hero-cf0a2308.webp',
  garagaraHero: '/images/garagara-hero-29297e9.webp',
} as const;

export const DEFAULT_CONTENT: EditableContent = {
  hero: {
    eyebrow: 'THREE WAYS TO PLAY',
    title: '選べる、\n3つの運試し。',
    description: '高速スロット、参加型ルーレット、昔ながらのガラガラ。\n今夜の気分で、好きなステージを選んでください。',
    note: 'デモ体験です / 実際の決済は行われません',
  },
  stages: {
    slot: {
      label: 'TYPE 01 / SLOT',
      title: '回して、止めて、\n3つの絵柄を揃える。',
      description: 'デモコインを入れたらSPIN。\n高速回転するリールを、3つのSTOPボタンで好きな順に止めてください。',
      instruction: 'まずデモコインを入れてください。',
      coinCta: 'コインを入れる',
      cta: 'SPIN',
      resultHeading: 'SLOT RESULT',
    },
    roulette: {
      label: 'TYPE 02 / ROULETTE',
      title: '回して、止まった場所が、\n今夜のラッキー。',
      description: 'ホイールを回して、ゴールドのポインターが指す場所を見届けます。\nSPECIAL、LUCKY、TRY AGAINのどこで止まるでしょうか。',
      instruction: 'ホイールを回す準備ができました。',
      coinCta: '準備完了',
      cta: 'ルーレットを回す',
      resultHeading: 'ROULETTE RESULT',
    },
    garagara: {
      label: 'TYPE 03 / GARAGARA',
      title: '回して、出てきた玉が、\n今夜のラッキー。',
      description: 'ハンドルを回すと、透明なドラムの中で玉が踊ります。\n排出口から出てきた1球で、今夜の運試しが決まります。',
      instruction: 'ハンドルを回して、玉を1つ引いてください。',
      coinCta: '準備完了',
      cta: 'ハンドルを回す',
      resultHeading: 'GARAGARA RESULT',
    },
  },
  prizeMessages: {
    special: 'SPECIALが出ました。\n今夜のスペシャルギフトをどうぞ。',
    standard: 'LUCKYが出ました。\nちょっと嬉しい特典をお届けします。',
    try: '今回はTRY AGAINでした。\nまた次のチャンスに、もう一度運試しをしてください。',
  },
};

export const PRIZES: Prize[] = [
  { id: 'special', label: '5,000円相当のボーナス', shortLabel: 'SPECIAL', color: '#DDFE5B', chance: 12 },
  { id: 'standard', label: '500円相当のギフト', shortLabel: 'LUCKY', color: '#71E5D2', chance: 33 },
  { id: 'try', label: 'また次のチャンスに', shortLabel: 'TRY AGAIN', color: '#FF7A65', chance: 55 },
];

export function pickPrize(): Prize {
  const roll = Math.random() * 100;
  let boundary = 0;
  for (const prize of PRIZES) {
    boundary += prize.chance;
    if (roll < boundary) return prize;
  }
  return PRIZES[PRIZES.length - 1];
}

export function prizeIcon(tier: PrizeTier): string {
  return tier === 'special' ? '✦' : tier === 'standard' ? '●' : '↗';
}
