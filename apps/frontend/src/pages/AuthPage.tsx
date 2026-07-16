import { useState, type FormEvent } from 'react';
import type { Session } from '../api';
import { api } from '../api';

export default function AuthPage({ session, onDone }: { session: Session; onDone: () => void }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    try {
      session.setupRequired ? await api.setup(data) : await api.login(data);
      onDone();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };

  return <section className="auth-page tracker-login">
    <form className="auth-card" onSubmit={submit}>
      <span className="eyebrow">Private farm journal</span>
      <h1>{session.setupRequired ? 'Create your farm' : 'Open your farm'}</h1>
      <p className="login-copy">Track the two-player save, goals, bundles, calendar, and hints without the public reference getting in the way.</p>
      {session.setupRequired && <>
        <label>Setup token<input name="setupToken" type="password" required /></label>
        <label>Farm name<input name="farmName" defaultValue="Our Farm" required maxLength={50} /></label>
        <label>Your display name<input name="displayName" required maxLength={40} /></label>
      </>}
      <label>Username<input name="username" autoComplete="username" required minLength={3} /></label>
      <label>Password<input name="password" type="password" autoComplete={session.setupRequired ? 'new-password' : 'current-password'} required minLength={10} /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button" disabled={busy}>{busy ? 'Please wait...' : session.setupRequired ? 'Create farm' : 'Sign in'}</button>
    </form>
  </section>;
}
