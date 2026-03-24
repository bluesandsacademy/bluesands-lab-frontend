"use client";

import { useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiSend,
  FiThumbsUp,
} from "react-icons/fi";
import { BsChatSquareText } from "react-icons/bs";

export default function DiscussionStep({ data, onContinue }: any) {
  const [reflection, setReflection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<any[]>(
    Array.isArray(data.classDiscussion) ? data.classDiscussion : [],
  );
  // const [posts, setPosts] = useState(data.classDiscussion);

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts((prev: any[]) => [
      ...prev,
      {
        id: `post-${Date.now()}`,
        name: "You",
        role: "Learner",
        time: "just now",
        text: newPost,
        avatarColor: "bg-indigo-400",
        initials: "ME",
      },
    ]);
    setNewPost("");
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Step header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-500">
          <BsChatSquareText size={18} />
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
            Step {data.stepNumber} of {data.totalSteps}
          </span>
          <h2 className="text-lg font-bold text-gray-800">Make a prediction</h2>
        </div>
      </div>

      {/* Reflection prompt */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-amber-500">
          Reflection Prompt
        </span>
        <p className="text-base font-semibold text-gray-800">
          {data.discussionPrompt}
        </p>
      </div>

      {/* Reflection input */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-1 text-sm font-semibold text-gray-800">
          Your Reflection
        </p>
        <textarea
          rows={3}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder={data.reflectionPlaceholder}
          disabled={submitted}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-indigo-400 focus:bg-white disabled:opacity-60"
        />
        {submitted ? (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
            <FiCheckCircle /> Reflection submitted!
          </div>
        ) : (
          <button
            disabled={!reflection.trim()}
            onClick={() => setSubmitted(true)}
            className="mt-3 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit Reflection
          </button>
        )}
      </div>

      {/* Class discussion */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <p className="text-sm font-semibold text-gray-800">
            Class Discussion
          </p>
          <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-500">
            {posts?.length} posts
          </span>
        </div>

        <div className="flex flex-col gap-5">
          {posts?.map((post: any) => (
            <div key={post.id} className="flex items-start gap-3">
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${post.avatarColor}`}
              >
                {post.initials}
              </div>
              <div className="flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">
                    {post.name}
                  </p>
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-400">
                    {post.role}
                  </span>
                  <span className="text-[10px] text-gray-400">{post.time}</span>
                </div>
                <p className="text-sm text-gray-600">{post.text}</p>
                <div className="mt-1.5 flex gap-3">
                  <button className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-indigo-500">
                    <FiThumbsUp size={11} /> Like
                  </button>
                  <button className="text-xs text-gray-400 transition hover:text-indigo-500">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New post input */}
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
          <input
            type="text"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePost()}
            placeholder="Share your thoughts with the class..."
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
          />
          <button
            onClick={handlePost}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-white transition hover:bg-indigo-600 disabled:opacity-40"
            disabled={!newPost.trim()}
          >
            <FiSend size={13} />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onContinue}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Continue <FiArrowRight />
        </button>
      </div>
    </div>
  );
}
