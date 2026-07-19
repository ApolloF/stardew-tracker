import { Component, type ReactNode } from 'react';
import GameIcon from './GameIcon';

export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div className="app-error">
      <GameIcon src="/game-icons/animals/chicken.webp" label="Journal error" size={44}/>
      <h1>Something went wrong on the farm</h1>
      <p>The journal hit an unexpected error. Reloading usually brings it back.</p>
      <button onClick={() => location.reload()}>Reload the journal</button>
    </div>;
  }
}
