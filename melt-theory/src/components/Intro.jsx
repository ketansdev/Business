import { useEffect, useRef } from 'react'
import { ASSETS } from '../lib/assets'

const PLAY_FOR = 2.0 // seconds of intro footage to show
const START_TIMEOUT = 1400 // ms to wait for playback to actually begin
const HARD_CAP = 4200 // ms – the intro can never hold the site longer than this

/**
 * Full-screen intro film. It never blocks the site: autoplay rejection,
 * network errors, a stalled load or reduced-motion all skip straight to the
 * reveal. `onDone` fires exactly once. The overlay's exit animation is owned
 * by the reveal timeline (so the hand-off is one continuous motion).
 */
export default function Intro({ onDone, skip, overlayRef }) {
  const videoRef = useRef(null)
  const doneRef = useRef(false)

  useEffect(() => {
    const finish = (reason) => {
      if (doneRef.current) return
      doneRef.current = true
      onDone(reason)
    }
    if (skip) {
      finish('reduced-motion')
      return
    }
    const v = videoRef.current
    if (!v) return finish('no-video')

    const timers = []
    let started = false
    const onPlaying = () => {
      if (started) return
      started = true
      // finish from the video clock where possible, timer as a backstop
      timers.push(setTimeout(() => finish('timer'), PLAY_FOR * 1000 + 450))
    }
    const onTime = () => v.currentTime >= PLAY_FOR && finish('played')
    const onError = () => finish('error')

    v.addEventListener('playing', onPlaying)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('ended', onError)
    v.addEventListener('error', onError)
    const lastSource = v.querySelector('source:last-of-type')
    lastSource?.addEventListener('error', onError)
    timers.push(setTimeout(() => !started && finish('slow-start'), START_TIMEOUT))
    timers.push(setTimeout(() => finish('cap'), HARD_CAP))

    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => finish('autoplay-blocked'))

    return () => {
      timers.forEach(clearTimeout)
      v.removeEventListener('playing', onPlaying)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('ended', onError)
      v.removeEventListener('error', onError)
      lastSource?.removeEventListener('error', onError)
    }
  }, [onDone, skip])

  return (
    <div className="intro" ref={overlayRef}>
      {!skip && (
        <video
          ref={videoRef}
          aria-hidden="true"
          className="intro__video"
          poster={ASSETS.introPoster}
          muted
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          controls={false}
        >
          {ASSETS.introVideo.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      )}
      <div className="intro__vignette" aria-hidden="true" />
      <div className="intro__brand" aria-hidden="true">
        <span className="intro__mark">MELT THEORY</span>
        <span className="intro__line" />
      </div>
      {!skip && (
        <button
          type="button"
          className="intro__skip"
          onClick={() => {
            if (!doneRef.current) {
              doneRef.current = true
              onDone('skipped')
            }
          }}
        >
          Skip intro
        </button>
      )}
    </div>
  )
}
