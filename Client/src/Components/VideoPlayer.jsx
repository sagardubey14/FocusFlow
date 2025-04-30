import React, { useState, useEffect } from "react";
import "./VideoPlayer.css";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    const video = document.querySelector(".video-element");
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const fastForward = () => {
    const video = document.querySelector(".video-element");
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  const handleTimeUpdate = () => {
    const video = document.querySelector(".video-element");
    const progressValue = (video.currentTime / video.duration) * 100;
    setProgress(progressValue);
  };

  const handleProgressBarClick = (e) => {
    const video = document.querySelector(".video-element");
    const progressBar = document.querySelector(".progress-bar");
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    video.currentTime = percentage * video.duration;
  };

  useEffect(() => {
    const video = document.querySelector(".video-element");
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", () => setProgress(0));
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div className="video-container">
      <video
        className="video-element"
        width="100%"
        src="Madeira_Cinematic FPV.mp4"
        controls={false}
      />
      <p className="video-credit">
        Video credit:{" "}
        <a
          href="https://youtu.be/NcBjx_eyvxc"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ellis van Jason on YouTube
        </a>
      </p>
      <div className="controls">
        <button onClick={togglePlay}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={fastForward}>Fast Forward 10s</button>
        <div className="progress-bar" onClick={handleProgressBarClick}>
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
