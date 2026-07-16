import { useEffect,useState,type ReactNode } from 'react';
import { Navigate,Route,Routes } from 'react-router-dom';
import { api,type Session } from './api';
import Layout from './components/Layout';
import ReferencePage from './pages/ReferencePageSafe';
import JournalPage from './pages/JournalPage';
import AuthPage from './pages/AuthPage';

export default function App(){const[session,setSession]=useState<Session|null>(null);const[refresh,setRefresh]=useState(0);useEffect(()=>{api.session().then(setSession).catch(()=>setSession({user:null,setupRequired:false}))},[refresh]);if(!session)return <div className="loading"><span>🌱</span><p>Opening the journal…</p></div>;const changed=()=>setRefresh(x=>x+1);const publicPage=(child:ReactNode)=><Layout session={session} onSessionChange={changed}>{child}</Layout>;return <Routes><Route path="/" element={session.user?<Navigate to="/dashboard" replace/>:<AuthPage session={session} onDone={changed}/>}/><Route path="/reference/:domain" element={session.user?publicPage(<ReferencePage session={session}/>):<Navigate to="/" replace/>}/><Route path="/login" element={session.user?<Navigate to="/dashboard" replace/>:<Navigate to="/" replace/>}/><Route path="/dashboard" element={session.user?<JournalPage session={session} onSessionChange={changed}/>:<Navigate to="/" replace/>}/><Route path="/assistant" element={session.user?<Navigate to="/dashboard?tab=assistant" replace/>:<Navigate to="/" replace/>}/><Route path="*" element={<Navigate to={session.user?'/dashboard':'/'} replace/>}/></Routes>}
