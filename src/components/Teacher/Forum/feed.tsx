"use client";

import { useState, useMemo } from "react";
import {
  Image,
  Paperclip,
  Smile,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Share2,
} from "lucide-react";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    subject: string;
  };
  timestamp: string;
  title: string;
  content: string;
  tag: string;
  hasAttachment?: boolean;
  stats: {
    comments: number;
    likes: number;
  };
}

interface CommunityFeedProps {
  searchQuery?: string;
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: {
      name: "Jane Doe",
      avatar: "/images/avatar/user01.png",
      subject: "7th Grade Math",
    },
    timestamp: "2 hours ago",
    title: "How do you keep your students engaged during virtual lessons?",
    content:
      "I've been experimenting with gamified quizzes but would love to know what others are doing. So, any help?",
    tag: "Class Management",
    stats: {
      comments: 23,
      likes: 23,
    },
  },
  {
    id: "2",
    author: {
      name: "Michael Chen",
      avatar: "/images/avatar/user01.png",
      subject: "Elementary Math",
    },
    timestamp: "4 hours ago",
    title: "Amazing free resources for teaching fractions visually",
    content:
      "Just discovered some fantastic online tools and printables that make fraction concepts click for students...",
    tag: "Resources",
    hasAttachment: true,
    stats: {
      comments: 23,
      likes: 23,
    },
  },
  {
    id: "3",
    author: {
      name: "Emma Thompson",
      avatar: "/images/avatar/user01.png",
      subject: "5th Grade",
    },
    timestamp: "6 hours ago",
    title: "How do you handle parent conferences virtually?",
    content:
      "With more schools offering virtual parent conferences, I'd love to hear your tips for making them effective...",
    tag: "Communication",
    stats: {
      comments: 23,
      likes: 23,
    },
  },
];

export default function CommunityFeed({
  searchQuery = "",
}: CommunityFeedProps) {
  const [postContent, setPostContent] = useState("");

  // Filter posts based on search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockPosts;
    }

    const query = searchQuery.toLowerCase();
    return mockPosts.filter((post) => {
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tag.toLowerCase().includes(query) ||
        post.author.name.toLowerCase().includes(query) ||
        post.author.subject.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Create Post Section */}
      <div className="flex flex-col gap-3 w-full p-3 md:p-4 bg-white rounded-xl shadow-sm">
        <div className="flex gap-2 md:gap-3 items-start">
          <div className="rounded-full bg-gradient-to-br from-gray-300 to-gray-400 h-10 w-10 md:h-12 md:w-12 flex-shrink-0 overflow-hidden">
            <img
              src="/images/avatar/user01.png"
              alt="Your avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2 md:gap-3 min-w-0">
            {/* Textarea */}
            <textarea
              name="post"
              id="post"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What do you want to talk about?"
              className="w-full min-h-[35px] resize-none border-none outline-none text-sm md:text-[15px] text-gray-700 placeholder:text-gray-400 placeholder:italic"
              style={{ fontFamily: "var(--font-jarkata)" }}
            />

            {/* Actions Row */}
            <div className="flex justify-between items-center pt-1 md:pt-2">
              {/* Attachment Icons */}
              <div className="flex gap-0.5 md:gap-1.5">
                <button
                  type="button"
                  className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Add image"
                >
                  <Image className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                </button>
                <button
                  type="button"
                  className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Add attachment"
                >
                  <Paperclip className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                </button>
                <button
                  type="button"
                  className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Add emoji"
                >
                  <Smile className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                </button>
              </div>

              {/* Post Button */}
              <button
                type="submit"
                className="bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 font-medium px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm transition-colors"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery.trim() && (
        <div className="px-2 md:px-0">
          <p
            className="text-sm text-gray-600"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            {filteredPosts.length === 0 ? (
              <span>No results found for "{searchQuery}"</span>
            ) : (
              <span>
                Found {filteredPosts.length} result
                {filteredPosts.length !== 1 ? "s" : ""} for "{searchQuery}"
              </span>
            )}
          </p>
        </div>
      )}

      {/* Posts Feed */}
      {filteredPosts.length === 0 && searchQuery.trim() ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl shadow-sm">
          <p
            className="text-gray-500 text-center mb-2"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            No discussions found
          </p>
          <p
            className="text-sm text-gray-400 text-center"
            style={{ fontFamily: "var(--font-jarkata)" }}
          >
            Try different keywords or browse all discussions
          </p>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col gap-3 md:gap-4 w-full p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Author Info */}
            <div className="flex gap-2 md:gap-3">
              <div className="rounded-full bg-gradient-to-br from-gray-300 to-gray-400 h-10 w-10 md:h-12 md:w-12 flex-shrink-0 overflow-hidden">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <p
                  className="text-sm md:text-[15px] font-semibold text-gray-900 truncate"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {post.author.name}
                </p>
                <div
                  className="text-xs md:text-[13px] flex gap-1 md:gap-1.5 items-center text-gray-500"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  <span className="truncate">{post.author.subject}</span>
                  <span className="text-[8px]">●</span>
                  <span className="whitespace-nowrap">{post.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="flex flex-col gap-1.5 md:gap-2">
              <h3
                className="font-semibold text-sm md:text-[15px] text-gray-900 leading-snug"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {post.title}
              </h3>
              <p
                className="text-xs md:text-[13px] text-gray-600 leading-relaxed"
                style={{ fontFamily: "var(--font-jarkata)" }}
              >
                {post.content}
              </p>
            </div>

            {/* Tag & Actions */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-1 md:pt-2">
              {/* Tag & Attachment */}
              <div className="flex gap-2 items-center flex-wrap">
                <span
                  className="rounded-full bg-gray-100 text-gray-600 text-[11px] md:text-[12px] font-medium px-2.5 md:px-3 py-1 md:py-1.5 whitespace-nowrap"
                  style={{ fontFamily: "var(--font-jarkata)" }}
                >
                  {post.tag}
                </span>
                {post.hasAttachment && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Paperclip className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span className="text-[11px] md:text-[12px]">
                      Attachment
                    </span>
                  </div>
                )}
              </div>

              {/* Engagement Actions */}
              <div className="flex gap-2 md:gap-3 items-center">
                <button
                  className="flex items-center gap-1 md:gap-1.5 text-gray-500 hover:text-primary transition-colors"
                  aria-label="Comments"
                >
                  <MessageSquare className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  <span className="text-xs md:text-[13px] font-medium">
                    {post.stats.comments}
                  </span>
                </button>

                <button
                  className="flex items-center gap-1 md:gap-1.5 text-gray-500 hover:text-primary transition-colors"
                  aria-label="Like"
                >
                  <ThumbsUp className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  <span className="text-xs md:text-[13px] font-medium">
                    {post.stats.likes}
                  </span>
                </button>

                <button
                  className="flex items-center text-gray-500 hover:text-primary transition-colors"
                  aria-label="Bookmark"
                >
                  <Bookmark className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </button>

                <button
                  className="flex items-center text-gray-500 hover:text-primary transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
