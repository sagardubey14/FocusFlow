import React, { useState, useEffect } from "react";
import "./VideoPlayer.css";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [progress, setProgress] = useState(0);
  const [userData, setUserData] = useState({
    userId: "user123",
    videoId: "video456",
    watchedIntervals: [
      { start: 0, end: 50 },
      { start: 60, end: 200 },
    ],
    resumePoint: 200,
    videoLength: 224.327982,
  });

  const mergeIntervals = (existingIntervals, newInterval) => {
    const allIntervals = [...existingIntervals, newInterval];
    allIntervals.sort((a, b) => a.start - b.start);
    const merged = [];
    for (let interval of allIntervals) {
      if (!merged.length || merged[merged.length - 1].end < interval.start) {
        merged.push(interval);
      } else {
        merged[merged.length - 1].end = Math.max(
          merged[merged.length - 1].end,
          interval.end
        );
      }
    }
    return merged;
  };

  const startInterval = (stTime, enTime) => {
    setUserData((prevData) => {
      return {
        ...prevData,
        watchedIntervals: [
          ...prevData.watchedIntervals,
          { start: stTime, end: enTime },
        ],
      };
    });
  };

  const endInterval = (enTime) => {
    let lastInterval = userData.watchedIntervals.pop();
    lastInterval = { ...lastInterval, end: enTime };
    setUserData((prevData) => {
      return {
        ...prevData,
        watchedIntervals: mergeIntervals(
          prevData.watchedIntervals,
          lastInterval
        ),
      };
    });
  };

  const togglePlay = () => {
    const video = document.querySelector(".video-element");
    if (video.paused) {
      video.play();
      startInterval(video.currentTime, video.currentTime);
      setIsPlaying(true);
    } else {
      video.pause();
      endInterval(video.currentTime);
      setIsPlaying(false);
    }
  };

  const fastForward = () => {
    const video = document.querySelector(".video-element");
    endInterval(video.currentTime);
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
    startInterval(video.currentTime, video.currentTime);
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
    const clickX = e.pageX - rect.left;
    const percentage = clickX / rect.width;
    endInterval(video.currentTime);
    video.currentTime = percentage * video.duration;
    startInterval(video.currentTime, video.currentTime);
  };

  useEffect(() => {
    const video = document.querySelector(".video-element");
    video.currentTime = userData.resumePoint;
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", () =>
      setProgress((userData.resumePoint / userData.videoLength) * 100)
    );
    const handleVideoEnd = () => {
      endInterval(video.duration);
      setIsPlaying(false);
    };
    video.addEventListener("ended", handleVideoEnd);
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 5000);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleVideoEnd);
      clearTimeout(timer);
    };
  }, []);

  const getTrueProgress = () => {
    const metric = userData.watchedIntervals.reduce((acc, interval) => {
      return acc + (interval.end - interval.start);
    }, 0);
    return ((metric / userData.videoLength) * 100).toFixed(2);
  };

  return (
    <div className="player" style={{ position: "relative" }}>
      <div className="video-container">
        <div className="video-wrapper">
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
              Ellis van Jason
            </a>
          </p>
        </div>

        <div className="controls-row">
          <div className="button-group">
            <button onClick={togglePlay}>{isPlaying ? "⏸️" : "▶️"}</button>
            <button onClick={fastForward}>{">> "}10s</button>
          </div>

          <div className="progress-bar" onClick={handleProgressBarClick}>
            {userData.watchedIntervals.map((interval, index) => {
              const startPercent =
                (interval.start / userData.videoLength) * 100;
              const endPercent = (interval.end / userData.videoLength) * 100;
              const widthPercent = endPercent - startPercent;
              return (
                <div
                  key={index}
                  className="watched-segment"
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`,
                  }}
                />
              );
            })}
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="circular-progress">
            <div
              className="circle"
              style={{
                background: `conic-gradient(${
                  getTrueProgress() === "100.00" ? "#2196f3" : "#4caf50"
                } ${getTrueProgress()}%, #444 ${getTrueProgress()}%)`,
              }}
            ></div>
            <span className="progress-text">{getTrueProgress()}%</span>
          </div>
        </div>
      </div>
      <div
        className="video-container"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: showSkeleton ? 2 : 0,
          pointerEvents: showSkeleton ? "auto" : "none",
          transition: "opacity 0.5s ease",
          opacity: showSkeleton ? 1 : 0,
        }}
      >
        <div className="video-wrapper skeleton-video">
          <div className="skeleton video-element" />
          <p className="video-credit skeleton-text" />
        </div>

        <div className="controls-row">
          <div className="button-group">
            <div className="skeleton skeleton-button" />
            <div className="skeleton skeleton-button" />
          </div>

          <div className="progress-bar">
            <div className="skeleton skeleton-progress" />
          </div>

          <div className="circular-progress">
            <div className="circle skeleton-circle" />
            <span className="progress-text skeleton-text" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
