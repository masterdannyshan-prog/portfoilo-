"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowsInIcon,
  ArrowsOutIcon,
  PauseIcon,
  PlayIcon,
  SpeakerHighIcon,
  SpeakerSlashIcon,
} from "@phosphor-icons/react";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function CaseStudyVideo({
  src,
  productName,
}: {
  src: string;
  productName: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    // Metadata may finish loading before React hydrates the controls.
    const video = videoRef.current;
    if (video && Number.isFinite(video.duration)) setDuration(video.duration);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
      } catch {
        setFailed(true);
      }
    } else {
      video.pause();
    }
  }

  function changeVolume(nextVolume: number) {
    const video = videoRef.current;
    if (!video) return;
    video.volume = nextVolume;
    video.muted = nextVolume === 0;
    setVolume(nextVolume);
    setMuted(video.muted);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await containerRef.current?.requestFullscreen();
    }
  }

  return (
    <div className="case-video" ref={containerRef} aria-label={`${productName} product demo video`}>
      <video
        ref={videoRef}
        src={src}
        preload="metadata"
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
        onError={() => setFailed(true)}
        aria-label={`${productName} website demo`}
      />

      {failed ? (
        <p className="case-video-error" role="alert">
          This video could not play here. <a href={src}>Open the video file</a>.
        </p>
      ) : !playing ? (
        <button className="case-video-poster-play" type="button" onClick={togglePlayback} aria-label={`Play ${productName} demo`}>
          <PlayIcon size={26} weight="fill" aria-hidden="true" />
        </button>
      ) : null}

      <div className="case-video-controls" role="group" aria-label="Video controls">
        <input
          className="case-video-progress"
          type="range"
          min="0"
          max={duration || 1}
          step="0.1"
          value={Math.min(currentTime, duration || 1)}
          onChange={(event) => {
            const time = Number(event.target.value);
            if (videoRef.current) videoRef.current.currentTime = time;
            setCurrentTime(time);
          }}
          aria-label="Seek video"
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          disabled={!duration}
        />
        <div className="case-video-control-row">
          <button type="button" onClick={togglePlayback} aria-label={playing ? "Pause video" : "Play video"}>
            {playing ? <PauseIcon size={20} weight="fill" aria-hidden="true" /> : <PlayIcon size={20} weight="fill" aria-hidden="true" />}
          </button>
          <span className="case-video-time" aria-hidden="true">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <div className="case-video-spacer" />
          <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute video" : "Mute video"}>
            {muted || volume === 0 ? <SpeakerSlashIcon size={20} aria-hidden="true" /> : <SpeakerHighIcon size={20} aria-hidden="true" />}
          </button>
          <input
            className="case-video-volume"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={(event) => changeVolume(Number(event.target.value))}
            aria-label="Volume"
            aria-valuetext={`${Math.round((muted ? 0 : volume) * 100)} percent`}
          />
          <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
            {fullscreen ? <ArrowsInIcon size={20} aria-hidden="true" /> : <ArrowsOutIcon size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SiteScopeHeroVideo() {
  return <CaseStudyVideo src="/videos/sitescope-demo.mp4" productName="SiteScope" />;
}
