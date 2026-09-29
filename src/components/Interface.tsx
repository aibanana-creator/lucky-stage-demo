import { useState } from 'react';
import type { EditableContent, HeroCopy, PrizeTier, StageCopy, StageId } from '../types';

interface EditorDrawerProps {
  content: EditableContent;
  activeStage: StageId;
  onChange: (next: EditableContent) => void;
  onReset: () => void;
  forceOpen?: boolean;
}

const STAGE_EDITOR_LABEL: Record<StageId, string> = { slot: '型1：スロット', roulette: '型2：ルーレット', garagara: '型3：ガラガラ' };

function TextField({ label, value, multiline = false, onChange }: { label: string; value: string; multiline?: boolean; onChange: (value: string) => void }) {
  return <label className="editor-field"><span>{label}</span>{multiline ? <textarea value={value} rows={3} onChange={(event) => onChange(event.target.value)} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

export function EditorDrawer({ content, activeStage, onChange, onReset, forceOpen = false }: EditorDrawerProps) {
  const [open, setOpen] = useState(false);
  const isOpen = forceOpen || open;
  const stage = content.stages[activeStage];
  const updateHero = (key: keyof HeroCopy, value: string) => onChange({ ...content, hero: { ...content.hero, [key]: value } });
  const updateStage = (key: keyof StageCopy, value: string) => onChange({ ...content, stages: { ...content.stages, [activeStage]: { ...stage, [key]: value } } });
  const updatePrizeMessage = (key: PrizeTier, value: string) => onChange({ ...content, prizeMessages: { ...content.prizeMessages, [key]: value } });

  return <section className={`editor-drawer ${isOpen ? 'is-open' : ''}`} aria-label="コンテンツ編集パネル">
    <div className="editor-heading"><div><p className="side-label">CONTENT STUDIO</p><h2>文章を編集</h2></div>{!forceOpen && <button type="button" className="editor-toggle" onClick={() => setOpen((current) => !current)} aria-expanded={isOpen}>{isOpen ? '閉じる' : '開く'}</button>}</div>
    <p className="editor-note">変更はこのブラウザに自動保存されます。</p>
    {isOpen && <div className="editor-body">
      <div className="editor-section"><p className="editor-section-title">ヒーロー</p><TextField label="上部ラベル" value={content.hero.eyebrow} onChange={(value) => updateHero('eyebrow', value)} /><TextField label="メインタイトル" value={content.hero.title} multiline onChange={(value) => updateHero('title', value)} /><TextField label="説明文" value={content.hero.description} multiline onChange={(value) => updateHero('description', value)} /><TextField label="注記" value={content.hero.note} onChange={(value) => updateHero('note', value)} /></div>
      <div className="editor-section"><p className="editor-section-title">{STAGE_EDITOR_LABEL[activeStage]}</p><TextField label="タイトル" value={stage.title} multiline onChange={(value) => updateStage('title', value)} /><TextField label="説明文" value={stage.description} multiline onChange={(value) => updateStage('description', value)} />{activeStage === 'slot' && <TextField label="コイン投入ボタン" value={stage.coinCta} onChange={(value) => updateStage('coinCta', value)} />}<TextField label="開始ボタン" value={stage.cta} onChange={(value) => updateStage('cta', value)} /><TextField label="結果見出し" value={stage.resultHeading} onChange={(value) => updateStage('resultHeading', value)} /></div>
      <div className="editor-section"><p className="editor-section-title">結果メッセージ</p><TextField label="SPECIAL" value={content.prizeMessages.special} multiline onChange={(value) => updatePrizeMessage('special', value)} /><TextField label="LUCKY" value={content.prizeMessages.standard} multiline onChange={(value) => updatePrizeMessage('standard', value)} /><TextField label="TRY AGAIN" value={content.prizeMessages.try} multiline onChange={(value) => updatePrizeMessage('try', value)} /></div>
      <button type="button" className="reset-copy" onClick={onReset}>初期文言に戻す</button>
    </div>}
  </section>;
}

interface ResultModalProps { content: EditableContent; stage: StageId; prize: { id: PrizeTier; label: string; shortLabel: string; color: string } | null; onRetry: () => void; }

export function ResultModal({ content, stage, prize, onRetry }: ResultModalProps) {
  if (!prize) return null;
  return <div className="result-overlay" role="dialog" aria-modal="true" aria-labelledby="result-title"><div className="result-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ '--i': index } as React.CSSProperties} />)}</div><section className="result-card" style={{ '--prize-color': prize.color } as React.CSSProperties}><p className="result-eyebrow">{content.stages[stage].resultHeading}</p><div className="result-orb">{prize.id === 'special' ? '✦' : prize.id === 'standard' ? '●' : '↗'}</div><p className="result-tier">{prize.shortLabel}</p><h2 id="result-title">{prize.label}</h2><p className="result-message">{content.prizeMessages[prize.id]}</p><button type="button" className="primary-button" onClick={onRetry}>もう一度、運試しをする <span>↗</span></button></section></div>;
}
