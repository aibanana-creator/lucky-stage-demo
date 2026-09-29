import { useState } from 'react';
import { EditorDrawer } from './Interface';
import type { EditableContent, StageId } from '../types';

interface ManagementPageProps { content: EditableContent; onChange: (next: EditableContent) => void; onReset: () => void; }

export function ManagementPage({ content, onChange, onReset }: ManagementPageProps) {
  const [activeStage, setActiveStage] = useState<StageId>('slot');
  return <main className="app-shell admin-shell"><div className="ambient ambient-a" /><div className="ambient ambient-b" />
    <header className="topbar"><a className="brand" href="/" aria-label="公開画面へ戻る"><img src="/lucky-stage-mark.svg" alt="" /><span><strong>LUCKY</strong> STAGE<em>CONTENT MANAGEMENT</em></span></a><div className="topbar-actions"><span className="sample-pill"><i /> MANAGE MODE</span><a href="/">公開画面へ <b>↗</b></a></div></header>
    <section className="admin-intro"><p className="hero-eyebrow">CONTENT MANAGEMENT</p><h1>文章と結果を、\nここで整える。</h1><p>公開ステージの操作と分けて、型1・型2・型3の文言を管理できます。変更はこのブラウザに自動保存されます。</p></section>
    <section className="admin-workspace"><nav className="admin-stage-switch" aria-label="編集する型を選択"><button type="button" className={activeStage === 'slot' ? 'is-active' : ''} onClick={() => setActiveStage('slot')}><span>TYPE 01</span><strong>SLOT</strong></button><button type="button" className={activeStage === 'roulette' ? 'is-active' : ''} onClick={() => setActiveStage('roulette')}><span>TYPE 02</span><strong>ROULETTE</strong></button><button type="button" className={activeStage === 'garagara' ? 'is-active' : ''} onClick={() => setActiveStage('garagara')}><span>TYPE 03</span><strong>GARAGARA</strong></button></nav><EditorDrawer forceOpen content={content} activeStage={activeStage} onChange={onChange} onReset={onReset} /></section>
  </main>;
}
