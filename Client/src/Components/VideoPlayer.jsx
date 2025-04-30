import React, { useState, useEffect } from "react";
import "./VideoPlayer.css";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userData, setUserData] = useState({
    userId: "user123",
    videoId: "video456",
    watchedIntervals: [
      { start: 0, end: 20 },
      { start: 50, end: 60 },
    ],
    resumePoint: 60,
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

  const togglePlay = () => {
    const video = document.querySelector(".video-element");
    if (video.paused) {
      video.play();
      setUserData((prevData) => {
        return {
          ...prevData,
          watchedIntervals: [
            ...prevData.watchedIntervals,
            { start: video.currentTime, end: video.currentTime + 2 },
          ],
        };
      });
      setIsPlaying(true);
    } else {
      video.pause();
      let lastInterval = userData.watchedIntervals.pop();
      lastInterval = { ...lastInterval, end: video.currentTime };
      setUserData((prevData) => {
        return {
          ...prevData,
          watchedIntervals: mergeIntervals(
            prevData.watchedIntervals,
            lastInterval
          ),
        };
      });
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
    const clickX = e.pageX - rect.left;
    const percentage = clickX / rect.width;
    video.currentTime = percentage * video.duration;
    setUserData((prevData) => {
      return {
        ...prevData,
        watchedIntervals: [
          ...prevData.watchedIntervals,
          {
            start: percentage * video.duration,
            end: percentage * video.duration + 1,
          },
        ],
      };
    });
  };

  useEffect(() => {
    const video = document.querySelector(".video-element");
    video.currentTime = userData.resumePoint;
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", () =>
      setProgress((userData.resumePoint / userData.videoLength) * 100)
    );
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const getTrueProgress = ()=>{
    const metric = userData.watchedIntervals.reduce((acc, interval)=>{
      return acc + (interval.end - interval.start) 
    },0);

    return (metric / userData.videoLength) *100;
  }

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
          {userData.watchedIntervals.map((interval, index) => {
            const startPercent = (interval.start / userData.videoLength) * 100;
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
      </div>
      <div className="true-progress" style={{ width: `${getTrueProgress()}%` }}></div>
    </div>
  );
};

export default VideoPlayer;
