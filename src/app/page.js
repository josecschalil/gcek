"use client";
import { useState } from "react";
import { subjectsData } from "./data/data";
import {
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Search,
  X,
  BookOpen,
} from "lucide-react";

export default function VideoClassesPage() {
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSubject = (subjectId) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

  const toggleChapter = (subjectId, chapterId) => {
    const key = `${subjectId}-${chapterId}`;
    setExpandedChapters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter subjects based on search query
  const filteredSubjects = subjectsData
    .map((subject) => {
      if (!searchQuery.trim()) {
        return subject;
      }

      const query = searchQuery.toLowerCase();
      const subjectMatches =
        subject.name.toLowerCase().includes(query) ||
        subject.description.toLowerCase().includes(query);

      const filteredChapters = subject.chapters
        .map((chapter) => {
          const chapterMatches = chapter.name.toLowerCase().includes(query);
          const matchingVideos = chapter.videos.filter((video) =>
            video.title.toLowerCase().includes(query)
          );

          if (chapterMatches || matchingVideos.length > 0) {
            return {
              ...chapter,
              videos:
                matchingVideos.length > 0 ? matchingVideos : chapter.videos,
            };
          }
          return null;
        })
        .filter(Boolean);

      if (subjectMatches || filteredChapters.length > 0) {
        return {
          ...subject,
          chapters:
            filteredChapters.length > 0 ? filteredChapters : subject.chapters,
        };
      }

      return null;
    })
    .filter(Boolean);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleVideoClick = (videoUrl, subjectName, chapterName, videoTitle) => {
    // Store video data in sessionStorage
    const videoData = {
      url: videoUrl,
      subject: subjectName,
      chapter: chapterName,
      title: videoTitle,
    };

    sessionStorage.setItem("currentVideo", JSON.stringify(videoData));

    // Navigate to player page
    // In real Next.js, use: router.push('/player')
    // For demo, we'll open in new window
    window.open("/player", "_blank");
  };

  const getTotalVideos = (subject) => {
    return subject.chapters.reduce(
      (total, chapter) => total + chapter.videos.length,
      0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Video Classes</h1>
        <p className="text-gray-600 mb-6">
          Select a subject to view chapters and classes
        </p>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by subject, chapter, or video title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              Found {filteredSubjects.length}{" "}
              {filteredSubjects.length === 1 ? "subject" : "subjects"}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No results found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            filteredSubjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
              >
                {/* Subject Card Header */}
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center text-white font-bold text-xl`}
                    >
                      {subject.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {subject.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {subject.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {subject.chapters.length}{" "}
                        {subject.chapters.length === 1 ? "chapter" : "chapters"}{" "}
                        • {getTotalVideos(subject)} videos
                      </p>
                    </div>
                  </div>
                  {expandedSubject === subject.id ? (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  )}
                </button>

                {/* Chapters List */}
                {expandedSubject === subject.id && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-4 space-y-3">
                      {subject.chapters.map((chapter) => {
                        const chapterKey = `${subject.id}-${chapter.id}`;
                        const isChapterExpanded = expandedChapters[chapterKey];

                        return (
                          <div
                            key={chapter.id}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                          >
                            {/* Chapter Header */}
                            <button
                              onClick={() =>
                                toggleChapter(subject.id, chapter.id)
                              }
                              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <BookOpen className="w-5 h-5 text-gray-500" />
                                <div className="text-left">
                                  <p className="font-medium text-gray-800">
                                    {chapter.name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {chapter.videos.length}{" "}
                                    {chapter.videos.length === 1
                                      ? "video"
                                      : "videos"}
                                  </p>
                                </div>
                              </div>
                              {isChapterExpanded ? (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              )}
                            </button>

                            {/* Videos List */}
                            {isChapterExpanded && (
                              <div className="border-t border-gray-200 bg-gray-50">
                                <div className="p-3 space-y-2">
                                  {chapter.videos.map((video) => (
                                    <button
                                      key={video.id}
                                      onClick={() =>
                                        handleVideoClick(
                                          video.url,
                                          subject.name,
                                          chapter.name,
                                          video.title
                                        )
                                      }
                                      className="w-full flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-all group"
                                    >
                                      <PlayCircle className="w-7 h-7 text-blue-500 group-hover:text-blue-600 flex-shrink-0" />
                                      <div className="flex-1 text-left">
                                        <p className="font-medium text-sm text-gray-800 group-hover:text-blue-600">
                                          {video.title}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate max-w-md mt-0.5">
                                          Click to play
                                        </p>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
