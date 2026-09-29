import { useEffect, useRef, useState } from 'react';
import type { Prize, StageCopy } from '../types';

const SYMBOLS = [
  { glyph: '✦', name: 'SPECIAL', color: '#DDFE5B' },
  { glyph: '◆', name: 'LUCKY', color: '#71E5D2' },
  { glyph: '●', name: 'PEARL', color: '#F4F0E8' },
  { glyph: '7', name: 'SEVEN', color: '#FF7A65' },
  { glyph: '☘', name: 'CLOVER', color: '#B5A7FF' },
] as const;

interface SlotGameProps {
  copy: StageCopy;
  onResult: (prize: Prize) => void;
  pickPrize: () => Prize;
}

function reelPattern(prize: Prize): number[] {
  if (prize.id === 'special') return [0, 0, 0];
  if (prize.id === 'standard') return [1, 1, 1];
  return [2, 3, 4];
}

export function SlotGame({ copy, onResult, pickPrize }: SlotGameProps) {
  const [hasCoin, setHasCoin] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [won, setWon] = useState(false);
  const [reels, setReels] = useState([2, 3, 4]);
  const [lockedReels, setLockedReels] = useState([false, false, false]);
  const ticker = useRef<number | null>(null);
  const resultTimer = useRef<number | null>(null);
  const lockedRef = useRef([false, false, false]);
  const selectedPrize = useRef<Prize | null>(null);
  const selectedPattern = useRef<number[] | null>(null);

  const clearSpinTimers = () => {
    if (ticker.current !== null) window.clearInterval(ticker.current);
    if (resultTimer.current !== null) window.clearTimeout(resultTimer.current);
    ticker.current = null;
    resultTimer.current = null;
  };

  useEffect(() => () => clearSpinTimers(), []);

  const insertCoin = () => {
    if (hasCoin || spinning || roundComplete) return;
    setHasCoin(true);
  };

  const finishRound = () => {
    const prize = selectedPrize.current;
    if (!prize) return;
    if (ticker.current !== null) window.clearInterval(ticker.current);
    ticker.current = null;
    setSpinning(false);
    setRoundComplete(true);
    setWon(prize.id !== 'try');
    resultTimer.current = window.setTimeout(() => onResult(prize), 380);
  };

  const stopReel = (index: number) => {
    const pattern = selectedPattern.current;
    if (!spinning || lockedRef.current[index] || !pattern) return;
    lockedRef.current[index] = true;
    setLockedReels([...lockedRef.current]);
    setReels((current) => current.map((symbol, reel) => reel === index ? pattern[index] : symbol));
    if (lockedRef.current.every(Boolean)) finishRound();
  };

  const spin = () => {
    if (!hasCoin || spinning || roundComplete) return;
    clearSpinTimers();
    const prize = pickPrize();
    selectedPrize.current = prize;
    selectedPattern.current = reelPattern(prize);
    lockedRef.current = [false, false, false];
    setLockedReels([false, false, false]);
    setWon(false);
    setRoundComplete(false);
    setHasCoin(false);
    setSpinning(true);
    ticker.current = window.setInterval(() => {
      setReels((current) => current.map((symbol, index) => lockedRef.current[index] ? symbol : Math.floor(Math.random() * SYMBOLS.length)));
    }, 34);
  };

  const status = roundComplete
    ? '絵柄を判定中です。結果をお待ちください。'
    : spinning
      ? '止めたいリールの STOP ボタンを押してください。'
      : hasCoin
        ? `コインを受け付けました。${copy.cta} が押せます。`
        : copy.instruction;

  return (
    <section className="game-panel slot-panel">
      <div className="game-copy">
        <p className="game-label">{copy.label}</p>
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>
      <div className="slot-stage">
        <div className={`slot-machine ${spinning ? 'is-spinning' : ''} ${roundComplete ? 'is-complete' : ''} ${won ? 'is-win' : ''}`}>
          <div className="slot-top"><span>LUCKY STAGE</span><strong>DEMO SLOT</strong><i>✦</i></div>
          <div className="slot-reels" aria-label="3リールのスロット表示">
            {reels.map((symbolIndex, index) => {
              const symbol = SYMBOLS[symbolIndex];
              return (
                <div key={index} className={`slot-reel ${lockedReels[index] ? 'is-locked' : ''}`}>
                  <span className="reel-symbol" style={{ color: symbol.color }}>{symbol.glyph}</span>
                  <small>{symbol.name}</small>
                </div>
              );
            })}
            <span className="slot-payline" aria-hidden="true" />
          </div>
          <div className="slot-stop-controls" aria-label="リールを個別に止める">
            {['01', '02', '03'].map((number, index) => (
              <button key={number} type="button" className={`stop-button ${lockedReels[index] ? 'is-locked' : ''}`} onClick={() => stopReel(index)} disabled={!spinning || lockedReels[index]}>
                <span>STOP</span><small>REEL {number}</small>
              </button>
            ))}
          </div>
          <div className="slot-controls">
            <button type="button" className={`coin-button ${hasCoin ? 'is-ready' : ''}`} onClick={insertCoin} disabled={hasCoin || spinning || roundComplete}>
              <span className="coin-mark">{hasCoin ? '✓' : '¥'}</span>
              <span><small>DEMO COIN</small><strong>{hasCoin ? 'READY' : copy.coinCta}</strong></span>
            </button>
            <button type="button" className="spin-button" onClick={spin} disabled={!hasCoin || spinning || roundComplete} aria-label={copy.cta}>
              <span>{copy.cta}</span><small>DEMO PLAY</small>
            </button>
          </div>
          <div className="slot-lights" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        </div>
        <div className="slot-status"><span className={spinning ? 'status-dot is-live' : 'status-dot'} />{status}</div>
      </div>
      <div className="game-footnote"><span>HOW TO PLAY</span><p>デモコインを入れてSPIN。高速回転したリールを、3つのSTOPボタンで好きな順に止めてください。</p></div>
    </section>
  );
}
