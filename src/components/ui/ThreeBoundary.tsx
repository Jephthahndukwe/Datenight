import { Component, type ReactNode } from 'react';

/** If anything in the 3D tree throws (context lost, chunk failed, GPU quirk), render nothing so the static art shows. */
export class ThreeBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* swallow: fallback art is already on screen */
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
