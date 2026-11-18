import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode; onError: () => void }

/** Any WebGL/R3F failure falls back to the static illustration instead of a blank stage. */
export default class CanvasErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.warn('[3D] falling back to static visual:', error)
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
