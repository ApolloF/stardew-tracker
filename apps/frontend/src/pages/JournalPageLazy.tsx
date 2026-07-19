import { lazy, Suspense } from 'react';
import type { Session } from '../api';
import GameIcon from '../components/GameIcon';
const JournalPage=lazy(()=>import('./JournalPage'));
export default function JournalPageLazy(props:{session:Session;onSessionChange:()=>void}){return <Suspense fallback={<div className="loading"><GameIcon src="/game-icons/animals/chicken.webp" label="Opening journal" size={44}/><p>Opening your farm journal...</p></div>}><JournalPage {...props}/></Suspense>}
