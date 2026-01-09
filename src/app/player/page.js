"use client";
import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Square,
  Maximize,
  Volume2,
  ArrowLeft,
} from "lucide-react";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const playerWrapRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [videoData, setVideoData] = useState(null);
  const hideControlsTimeout = useRef(null);

  // Load video data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem("currentVideo");
    if (storedData) {
      const data = JSON.parse(storedData);
      setVideoData(data);

      // Auto-play when video loads
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.log("Auto-play prevented:", err);
          });
        }
      }, 500);
    }
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    const video = videoRef.current;
    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    setCurrentTime(video.currentTime);
    setDuration(video.duration);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseFloat(e.target.value);
    videoRef.current.playbackRate = newSpeed;
    setPlaybackRate(newSpeed);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      video.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoData({ ...videoData, url: url, title: file.name });
      videoRef.current.src = url;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(hideControlsTimeout.current);
    hideControlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2000);
  };

  const goBack = () => {
    // In real Next.js: router.back() or router.push('/')
    window.close();
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const video = videoRef.current;
      if (!video) return;

      if (e.code === "Space") {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "ArrowRight") {
        video.currentTime = Math.min(video.currentTime + 5, video.duration);
      } else if (e.key === "ArrowLeft") {
        video.currentTime = Math.max(video.currentTime - 5, 0);
      } else if (e.key === ">" && e.shiftKey) {
        const newSpeed = Math.min(video.playbackRate + 0.1, 3);
        video.playbackRate = newSpeed;
        setPlaybackRate(newSpeed);
      } else if (e.key === "<" && e.shiftKey) {
        const newSpeed = Math.max(video.playbackRate - 0.1, 0.5);
        video.playbackRate = newSpeed;
        setPlaybackRate(newSpeed);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying]);

  const seekPercentage = duration ? (currentTime / duration) * 100 : 0;

  if (!videoData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No video selected</p>
          <button
            onClick={goBack}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Classes</span>
          </button>
          <div className="text-right">
            <h1 className="text-white font-semibold">{videoData.title}</h1>
            <p className="text-gray-400 text-sm">
              {videoData.subject} • {videoData.chapter}
            </p>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div
        className="flex items-center justify-center p-4"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div
          ref={playerWrapRef}
          className="relative w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl"
          onMouseMove={handleMouseMove}
        >
          <video
            ref={videoRef}
            src={videoData.url}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => {
              setIsPlaying(false);
              setShowControls(true);
            }}
            className="w-full h-auto bg-black"
          />

          {/* Controls */}
          <div
            className={`absolute bottom-0 left-0 w-full bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Progress Bar */}
            <div className="px-4 pt-2">
              <input
                type="range"
                min="0"
                max="100"
                value={seekPercentage}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${seekPercentage}%, #4b5563 ${seekPercentage}%, #4b5563 100%)`,
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-3">
                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                {/* Stop */}
                <button
                  onClick={handleStop}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <Square size={24} />
                </button>

                {/* Time Display */}
                <span className="text-sm text-gray-300 ml-2">
                  {Math.floor(currentTime / 60)}:
                  {String(Math.floor(currentTime % 60)).padStart(2, "0")} /{" "}
                  {Math.floor(duration / 60)}:
                  {String(Math.floor(duration % 60)).padStart(2, "0")}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <Volume2 size={20} className="text-gray-300" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Speed */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">Speed:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={playbackRate}
                    onChange={handleSpeedChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <span className="text-sm text-gray-300 w-12">
                    {playbackRate.toFixed(1)}x
                  </span>
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  <Maximize size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div
            className={`absolute top-4 right-4 bg-black bg-opacity-70 rounded-lg p-3 text-xs text-gray-300 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="font-semibold mb-1">Keyboard Shortcuts:</p>
            <p>Space - Play/Pause</p>
            <p>F - Fullscreen</p>
            <p>← → - Seek 5s</p>
            <p>Shift + &gt; / &lt; - Speed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
