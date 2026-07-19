import { lazy, Suspense } from 'react';
import type { Session } from '../api';
const ReferencePageSafe=lazy(()=>import('./ReferencePageSafe'));
export default function ReferencePageLazy({session}:{session:Session}){return <Suspense fallback={<div className="loading"><p>Opening reference...</p></div>}><ReferencePageSafe session={session}/></Suspense>}
