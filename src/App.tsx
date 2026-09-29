import { useState } from 'react';
import './styles.css';
import { ASSET_URLS, pickPrize } from './content/stageContent';
import { GaragaraGame } from './components/GaragaraGame';
import { ResultModal } from './components/Interface';
import { ManagementPage } from './components/ManagementPage';
import { RouletteGame } from './components/RouletteGame';
import { SlotGame } from './components/SlotGame';
import { usePersistentContent } from './hooks/usePersistentContent';
import type { Prize, StageId } from './types';

const TYPE_META: Record<StageId, { number: string; title: string; caption: string }> = {
  slot: { number: '01', title: 'SLOT', caption: '高速3リールを止める' },
  roulette: { number: '02', title: 'ROULETTE', caption: 'ホイールの停止位置を見届ける' },
  garagara: { number: '03', title: 'GARAGARA', caption: 'ハンドルを回して玉を引く' },
};

export default function App() {
  const { content, setContent, resetContent } = usePersistentContent();
  if (window.location.pathname.startsWith('/manage')) return <ManagementPage content={content} onChange={setContent} onReset={resetContent} />;

  const [activeStage, setActiveStage] = useState<StageId>('slot');
  const [result, setResult] = useState<Prize | null>(null);
  const [roundKey, setRoundKey] = useState(0);
  const meta = TYPE_META[activeStage];
  const retry = () => { setResult(null); setRoundKey((current) => current + 1); };
  const heroBackground = activeStage === 'roulette'
    ? `radial-gradient(circle at 72% 48%, rgba(221,254,91,.22), transparent 18%), linear-gradient(90deg, rgba(7,24,39,.42), transparent 64%), url(${ASSET_URLS.rouletteHero})`
    : activeStage === 'garagara'
      ? `radial-gradient(circle at 70% 48%, rgba(113,229,210,.18), transparent 20%), linear-gradient(90deg, rgba(7,24,39,.42), transparent 64%), url(${ASSET_URLS.garagaraHero})`
      : `url(${ASSET_URLS.slot})`;
  const heroClass = activeStage === 'roulette' ? 'is-roulette' : activeStage === 'garagara' ? 'is-garagara' : '';
  const heroLabel = activeStage === 'roulette' ? 'ルーレットラウンジのイメージ' : activeStage === 'garagara' ? 'ガラガラ抽選のイメージ' : 'スロットラウンジのイメージ';

  return <main className="app-shell"><div className="ambient ambient-a" /><div className="ambient ambient-b" />
    <header className="topbar"><a className="brand" href="#top" aria-label="Lucky Stage ホームへ"><img src="/lucky-stage-mark.svg" alt="" /><span><strong>LUCKY</strong> STAGE<em>抽選ラウンジ</em></span></a><div className="topbar-actions"><span className="sample-pill"><i /> {`TYPE ${meta.number} MODE`}</span><a href="/manage">文章を管理 <b>↗</b></a></div></header>
    <section className="hero" id="top"><div className="hero-copy"><p className="hero-eyebrow">{content.hero.eyebrow}</p><h1>{content.hero.title}</h1><p className="hero-description">{content.hero.description}</p><div className="hero-note"><span>✦</span>{content.hero.note}</div></div><div className={`hero-visual ${heroClass}`} style={{ backgroundImage: heroBackground }} aria-label={heroLabel} role="img"><div className="hero-stamp"><span>TYPE {meta.number}</span><strong>{meta.title}<br />STAGE</strong></div></div></section>
    <nav className="type-selector" aria-label="抽選型を選択">{(Object.keys(TYPE_META) as StageId[]).map((stage) => <button key={stage} type="button" className={activeStage === stage ? 'is-active' : ''} onClick={() => { setActiveStage(stage); setResult(null); setRoundKey((current) => current + 1); }}><span>TYPE {TYPE_META[stage].number}</span><strong>{TYPE_META[stage].title}</strong><small>{TYPE_META[stage].caption}</small></button>)}</nav>
    <section className="experience-layout stage-only" aria-label={`${meta.title} 抽選ステージ`}><div className="experience-main"><div className="section-kicker"><span>{`LIVE ${meta.title}`}</span><i /> <span>DEMO PLAY</span></div>{activeStage === 'slot' ? <SlotGame key={`slot-${roundKey}`} copy={content.stages.slot} onResult={setResult} pickPrize={pickPrize} /> : activeStage === 'roulette' ? <RouletteGame key={`roulette-${roundKey}`} copy={content.stages.roulette} onResult={setResult} pickPrize={pickPrize} /> : <GaragaraGame key={`garagara-${roundKey}`} copy={content.stages.garagara} onResult={setResult} pickPrize={pickPrize} />}</div></section>
    <footer><span>LUCKY STAGE / TYPE 01 SLOT + TYPE 02 ROULETTE + TYPE 03 GARAGARA</span><span>NO REAL PAYMENTS</span></footer><ResultModal content={content} stage={activeStage} prize={result} onRetry={retry} />
  </main>;
}
