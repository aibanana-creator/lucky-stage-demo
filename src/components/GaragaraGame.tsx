import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Prize, StageCopy } from '../types';

interface GaragaraGameProps { copy: StageCopy; onResult: (prize: Prize) => void; pickPrize: () => Prize; }
type GaragaraPhase = 'ready' | 'spinning' | 'releasing' | 'complete';

const DISPLAY_BALLS = [
  { className: 'garagara-ball ball-a', color: '#DDFE5B' },
  { className: 'garagara-ball ball-b', color: '#FF7A65' },
  { className: 'garagara-ball ball-c', color: '#71E5D2' },
  { className: 'garagara-ball ball-d', color: '#F4F0E8' },
  { className: 'garagara-ball ball-e', color: '#B4A2FF' },
  { className: 'garagara-ball ball-f', color: '#FFC86B' },
];

export function GaragaraGame({ copy, onResult, pickPrize }: GaragaraGameProps) {
  const [phase, setPhase] = useState<GaragaraPhase>('ready');
  const [drawnPrize, setDrawnPrize] = useState<Prize | null>(null);
  const timers = useRef<number[]>([]);
  const clearTimers = () => { timers.current.forEach((timer) => window.clearTimeout(timer)); timers.current = []; };
  useEffect(() => () => clearTimers(), []);

  const turnHandle = () => {
    if (phase !== 'ready') return;
    const prize = pickPrize();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setDrawnPrize(prize);
    setPhase('spinning');
    const releaseTimer = window.setTimeout(() => setPhase('releasing'), reducedMotion ? 30 : 1450);
    const resultTimer = window.setTimeout(() => { setPhase('complete'); onResult(prize); }, reducedMotion ? 150 : 2350);
    timers.current.push(releaseTimer, resultTimer);
  };

  const active = phase === 'spinning' || phase === 'releasing';
  const released = phase === 'releasing' || phase === 'complete';
  const status = phase === 'ready' ? copy.instruction : phase === 'spinning' ? 'ドラムの中で玉が回っています。排出口を見届けてください。' : phase === 'releasing' ? '玉が出てきます。結果を確認してください。' : `${drawnPrize?.shortLabel ?? 'DRAW'} の玉が出ました。`;
  const resultColor = drawnPrize?.color ?? '#DDFE5B';

  return <section className="game-panel garagara-panel">
    <div className="game-copy"><p className="game-label">{copy.label}</p><h2>{copy.title}</h2><p>{copy.description}</p></div>
    <div className="garagara-stage">
      <div className={`garagara-machine ${active ? 'is-active' : ''} ${released ? 'is-released' : ''}`} style={{ '--drawn-color': resultColor } as CSSProperties}>
        <div className={`garagara-drum ${active ? 'is-spinning' : ''}`} aria-label="ガラガラ抽選ドラム"><div className="garagara-grid" />{DISPLAY_BALLS.map((ball) => <i key={ball.className} className={ball.className} style={{ '--ball-color': ball.color } as CSSProperties} />)}</div>
        <div className="garagara-axis" aria-hidden="true" />
        <div className="garagara-stand" aria-hidden="true"><i /><i /></div>
        <div className="garagara-chute" aria-label="抽選玉の排出口"><span className={released ? 'is-releasing' : ''} /></div>
        <button type="button" className={`garagara-handle ${active ? 'is-spinning' : ''}`} onClick={turnHandle} disabled={phase !== 'ready'} aria-label={copy.cta}><i aria-hidden="true" /><span><small>{phase === 'ready' ? 'TURN THE HANDLE' : phase === 'spinning' ? 'MIXING BALLS' : phase === 'releasing' ? 'BALL RELEASE' : 'DRAW COMPLETE'}</small><strong>{phase === 'ready' ? copy.cta : phase === 'spinning' ? '回転中' : phase === 'releasing' ? '玉が出ます' : '結果を見る'}</strong></span></button>
      </div>
      <div className={`garagara-readout ${released ? 'is-hit' : ''}`}><small>DRAWN BALL</small><strong>{released ? drawnPrize?.shortLabel : 'READY'}</strong><span>{released ? '排出口から出た玉' : 'ハンドルを回して抽選開始'}</span></div>
      <p className="garagara-status" aria-live="polite"><i className={active ? 'status-dot is-live' : 'status-dot'} />{status}</p>
    </div>
    <div className="game-footnote"><span>HOW TO PLAY</span><p>ハンドルを回すと、透明なドラムの中で玉が回転します。排出口から出てくる1球で、今夜の運試しが決まります。</p></div>
  </section>;
}
