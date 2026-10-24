"use client";

import { useEffect, useRef, useState } from "react";
import { bassStrings } from "@/content/music";

const FRETS = 12;
// Real fret spacing: each fret is 2^(-1/12) closer to the bridge.
const fretPositions = Array.from(
  { length: FRETS },
  (_, i) => (1 - 2 ** (-(i + 1) / 12)) * 2,
);
const inlays = [3, 5, 7, 9].map((fret) => (fretPositions[fret - 2] + fretPositions[fret - 1]) / 2);
const twelfth = (fretPositions[10] + fretPositions[11]) / 2;
const STRAIGHT = "M0 20 Q500 20 1000 20";

type Vibration = { amp: number; start: number; x: number };

// Karplus–Strong plucked string, rendered once per note.
function renderPluck(ctx: AudioContext, frequency: number) {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * 2.4);
  const buffer = ctx.createBuffer(1, length, rate);
  const data = buffer.getChannelData(0);
  const period = Math.max(2, Math.round(rate / frequency));
  let smooth = 0;
  for (let i = 0; i < period; i += 1) {
    smooth = smooth * 0.55 + (Math.random() * 2 - 1) * 0.45;
    data[i] = smooth;
  }
  for (let i = period; i < length; i += 1) {
    data[i] = 0.997 * 0.5 * (data[i - period] + (data[i - period - 1] ?? 0));
  }
  let peak = 0;
  for (let i = 0; i < length; i += 1) peak = Math.max(peak, Math.abs(data[i]));
  if (peak > 0) for (let i = 0; i < length; i += 1) data[i] /= peak;
  return buffer;
}

export function BassStrings() {
  const stringsRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const vibrations = useRef<(Vibration | null)[]>([]);
  const frame = useRef(0);
  const audio = useRef<{ ctx: AudioContext; buffers: Map<number, AudioBuffer> } | null>(null);
  const pressed = useRef(false);
  const lastRow = useRef(-1);
  const ringTimer = useRef(0);
  const [ringing, setRinging] = useState<number | null>(null);

  useEffect(() => {
    const frames = frame;
    const timers = ringTimer;
    const sound = audio;
    return () => {
      window.cancelAnimationFrame(frames.current);
      window.clearTimeout(timers.current);
      void sound.current?.ctx.close();
    };
  }, []);

  const animate = (now: number) => {
    let active = false;
    vibrations.current.forEach((vibration, row) => {
      const path = pathRefs.current[row];
      if (!vibration || !path) return;
      const t = (now - vibration.start) / 1000;
      const envelope = vibration.amp * Math.exp(-t * 3.4);
      if (envelope < 0.15) {
        vibrations.current[row] = null;
        path.setAttribute("d", STRAIGHT);
        return;
      }
      active = true;
      const offset = envelope * Math.cos(t * Math.PI * 2 * (9 + row * 1.5));
      path.setAttribute("d", `M0 20 Q${vibration.x * 1000} ${20 + offset * 2} 1000 20`);
    });
    frame.current = active ? window.requestAnimationFrame(animate) : 0;
  };

  const play = (row: number) => {
    if (!audio.current) {
      audio.current = { ctx: new AudioContext(), buffers: new Map() };
    }
    const { ctx, buffers } = audio.current;
    if (ctx.state === "suspended") void ctx.resume();
    let buffer = buffers.get(row);
    if (!buffer) {
      buffer = renderPluck(ctx, bassStrings[row].frequency);
      buffers.set(row, buffer);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1100;
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.85, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(now);
    source.stop(now + 2.4);
  };

  // `time` is the triggering event's timeStamp, on the same clock as requestAnimationFrame.
  const pluck = (row: number, x: number, withSound: boolean, strength: number, time: number) => {
    vibrations.current[row] = {
      amp: strength,
      start: time,
      x: Math.min(0.92, Math.max(0.08, x)),
    };
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && !frame.current) frame.current = window.requestAnimationFrame(animate);
    if (withSound) {
      play(row);
      setRinging(row);
      window.clearTimeout(ringTimer.current);
      ringTimer.current = window.setTimeout(() => setRinging(null), 1400);
    }
  };

  const locate = (event: React.PointerEvent) => {
    const rect = stringsRef.current!.getBoundingClientRect();
    const rows = bassStrings.length;
    const row = Math.min(rows - 1, Math.max(0, Math.floor(((event.clientY - rect.top) / rect.height) * rows)));
    return { row, x: (event.clientX - rect.left) / rect.width };
  };

  const onPointerDown = (event: React.PointerEvent) => {
    pressed.current = true;
    const { row, x } = locate(event);
    lastRow.current = row;
    pluck(row, x, true, 13, event.timeStamp);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const { row, x } = locate(event);
    if (row === lastRow.current) return;
    lastRow.current = row;
    if (pressed.current) pluck(row, x, true, 12, event.timeStamp);
    else if (event.pointerType === "mouse") pluck(row, x, false, 5, event.timeStamp);
  };

  const release = () => {
    pressed.current = false;
  };

  const ringingString = ringing === null ? null : bassStrings[ringing];

  return (
    <div className="bass-board">
      <div className="bass-labels" aria-hidden>
        {bassStrings.map((string, row) => (
          <span key={string.name} data-ringing={ringing === row}>
            {string.name}
          </span>
        ))}
      </div>
      <div
        ref={stringsRef}
        className="bass-strings"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={() => {
          release();
          lastRow.current = -1;
        }}
      >
        <div className="bass-frets" aria-hidden>
          {fretPositions.map((position) => (
            <span key={position} className="bass-fret" style={{ left: `${position * 100}%` }} />
          ))}
          {inlays.map((position) => (
            <span key={position} className="bass-inlay" style={{ left: `${position * 100}%` }} />
          ))}
          <span className="bass-inlay bass-inlay-double" style={{ left: `${twelfth * 100}%` }} />
        </div>
        {bassStrings.map((string, row) => (
          <button
            key={string.name}
            type="button"
            className="bass-string"
            data-row={row}
            aria-label={`拨 ${string.name} 弦（${string.note}）`}
            onClick={(event) => {
              // Pointer plucks are handled above; this covers keyboard activation.
              if (event.detail === 0) pluck(row, 0.5, true, 13, event.timeStamp);
            }}
          >
            <svg viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden>
              <path
                ref={(node) => {
                  pathRefs.current[row] = node;
                }}
                d={STRAIGHT}
              />
            </svg>
          </button>
        ))}
      </div>
      <p className="bass-readout" aria-live="polite">
        {ringingString ? (
          <>
            <strong>{ringingString.note}</strong> · {ringingString.frequency} Hz
          </>
        ) : (
          <>
            <span className="hint-fine">按住鼠标划过琴弦试试</span>
            <span className="hint-touch">点一下琴弦试试</span>
            <span className="bass-readout-note"> · 会有声音</span>
          </>
        )}
      </p>
    </div>
  );
}
