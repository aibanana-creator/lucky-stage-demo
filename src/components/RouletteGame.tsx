import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Prize, PrizeTier, StageCopy } from '../types';

interface RouletteGameProps { copy: StageCopy; onResult: (prize: Prize) => void; pickPrize: () => Prize; }
type RoulettePhase = 'ready' | 'spinning' | 'stopping' | 'complete';

const WHEEL_SEGMENTS: Array<{ tier: PrizeTier; label: string; code: string; color: string }> = [
  { tier: 'special', label: 'SPECIAL', code: '5K', color: '#DDFE5B' },
  { tier: 'try', label: 'TRY AGAIN', code: 'NEXT', color: '#FF7A65' },
  { tier: 'standard', label: 'LUCKY', code: '500', color: '#71E5D2' },
  { tier: 'try', label: 'TRY AGAIN', code: 'NEXT', color: '#FF7A65' },
  { tier: 'standard', label: 'LUCKY', code: '500', color: '#71E5D2' },
  { tier: 'try', label: 'TRY AGAIN', code: 'NEXT', color: '#FF7A65' },
  { tier: 'standard', label: 'LUCKY', code: '500', color: '#71E5D2' },
  { tier: 'try', label: 'TRY AGAIN', code: 'NEXT', color: '#FF7A65' },
  { tier: 'standard', label: 'LUCKY', code: '500', color: '#71E5D2' },
  { tier: 'try', label: 'TRY AGAIN', code: 'NEXT', color: '#FF7A65' },
  { tier: 'standard', label: 'LUCKY', code: '500', color: '#71E5D2' },
  { tier: 'try', label: 'TRY AGAIN', code: 'NEXT', color: '#FF7A65' },
];

function normalizedAngle(angle: number) { return ((angle % 360) + 360) % 360; }

export function RouletteGame({ copy, onResult, pickPrize }: RouletteGameProps) {
  const [phase, setPhase] = useState<RoulettePhase>('ready');
  const [stopReady, setStopReady] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [pendingPrize, setPendingPrize] = useState<Prize | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((timer) => { window.clearTimeout(timer); window.clearInterval(timer); });
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const getVisibleAngle = () => {
    const transform = wheelRef.current ? window.getComputedStyle(wheelRef.current).transform : 'none';
    const values = transform.match(/^matrix\((.+)\)$/)?.[1].split(',').map(Number);
    if (!values || values.length < 2 || values.some(Number.isNaN)) return normalizedAngle(rotation);
    return normalizedAngle(Math.atan2(values[1], values[0]) * 180 / Math.PI);
  };

  const startSpin = () => {
    if (phase !== 'ready') return;
    const prize = pickPrize();
    const matchingIndexes = WHEEL_SEGMENTS.flatMap((segment, index) => segment.tier === prize.id ? [index] : []);
    const targetIndex = matchingIndexes[Math.floor(Math.random() * matchingIndexes.length)];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPendingPrize(prize);
    setSelectedIndex(targetIndex);
    setPhase('spinning');
    setStopReady(false);
    setRotation((current) => current + 2160);
    const readyTimer = window.setTimeout(() => setStopReady(true), reducedMotion ? 30 : 600);
    const keepSpinning = window.setInterval(() => setRotation((current) => current + 2160), reducedMotion ? 80 : 1950);
    timers.current.push(readyTimer, keepSpinning);
  };

  const stopSpin = () => {
    if (phase !== 'spinning' || !stopReady || selectedIndex === null || !pendingPrize) return;
    const currentAngle = getVisibleAngle();
    const targetBase = normalizedAngle(-selectedIndex * 30);
    let delta = normalizedAngle(targetBase - currentAngle);
    if (delta < 150) delta += 360;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    clearTimers();
    setStopReady(false);
    setPhase('stopping');
    setRotation(currentAngle);
    const settleTimer = window.setTimeout(() => setRotation(currentAngle + delta), reducedMotion ? 0 : 32);
    const resultTimer = window.setTimeout(() => { setPhase('complete'); onResult(pendingPrize); }, reducedMotion ? 140 : 980);
    timers.current.push(settleTimer, resultTimer);
  };

  const selected = selectedIndex === null ? null : WHEEL_SEGMENTS[selectedIndex];
  const spinning = phase === 'spinning';
  const complete = phase === 'complete';
  const controlDisabled = phase === 'stopping' || complete || (spinning && !stopReady);
  const controlMain = spinning ? (stopReady ? 'STOP' : 'WAIT') : phase === 'stopping' ? 'LOCK' : complete ? 'DONE' : 'SPIN';
  const controlCaption = spinning ? (stopReady ? 'タップで止める' : '回転中') : phase === 'stopping' ? '停止位置へ' : complete ? '抽選完了' : copy.cta;
  const status = complete ? `${selected?.label ?? 'WINNING SEGMENT'} に停止しました。` : phase === 'stopping' ? '停止位置を合わせています。' : spinning ? (stopReady ? 'ホイール外縁のSTOPを押して、あなたのタイミングで止めてください。' : '回転を始めました。まもなくSTOPできるようになります。') : copy.instruction;
  const wheelStyle = { '--wheel-rotation': `${rotation}deg`, '--winning-color': selected?.color ?? '#DDFE5B' } as CSSProperties;

  return <section className="game-panel roulette-panel">
    <div className="game-copy"><p className="game-label">{copy.label}</p><h2>{copy.title}</h2><p>{copy.description}</p></div>
    <div className="roulette-stage">
      <div className="roulette-machine" aria-label="ルーレットホイール">
        <span className="roulette-pointer" aria-hidden="true" />
        <div ref={wheelRef} className={`roulette-wheel ${spinning ? 'is-spinning' : ''} ${phase === 'stopping' ? 'is-stopping' : ''} ${complete ? 'is-locked' : ''}`} style={wheelStyle}>
          <div className="roulette-rail" />
          {WHEEL_SEGMENTS.map((segment, index) => <span key={`${segment.tier}-${index}`} className={`roulette-segment ${complete && index === selectedIndex ? 'is-selected' : ''}`} style={{ '--segment-angle': `${index * 30}deg`, '--segment-color': segment.color } as CSSProperties}><b>{segment.label}</b><small>{segment.code}</small></span>)}
          <div className="roulette-hub"><span>LUCKY</span><strong>{spinning ? 'LIVE' : 'SPIN'}</strong></div>
        </div>
        <button type="button" className={`roulette-control ${spinning && stopReady ? 'is-stop-ready' : ''}`} onClick={spinning ? stopSpin : startSpin} disabled={controlDisabled} aria-label={spinning ? 'ルーレットを止める' : copy.cta}><span>{controlCaption}</span><strong>{controlMain}</strong><small>{spinning && stopReady ? 'PRESS TO STOP' : spinning ? 'PLEASE WAIT' : 'TAP TO START'}</small></button>
      </div>
      <div className="roulette-action"><div className={`roulette-readout ${complete ? 'is-hit' : ''}`}><small>WINNING SEGMENT</small><strong>{complete ? selected?.label : spinning ? 'IN PLAY' : 'READY'}</strong><span>{complete ? 'ポインター下で停止中' : spinning ? '停止のタイミングを選択' : 'ホイール外縁のSPINで開始'}</span></div><p aria-live="polite"><i className={spinning ? 'status-dot is-live' : 'status-dot'} />{status}</p></div>
    </div>
    <div className="game-footnote"><span>HOW TO PLAY</span><p>ホイール外縁のSPINで回転を始め、同じ近接したSTOP操作で停止を確定します。ゴールドのポインターが指す当選セグメントを確認してください。</p></div>
  </section>;
}
