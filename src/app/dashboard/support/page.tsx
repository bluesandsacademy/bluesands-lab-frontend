"use client";
import { submitSupportTicket } from "@/services/auth-service";
import { useUser } from "@/services/UserContext";
import React, { useState } from "react";
import { BsChatFill } from "react-icons/bs";
import { FaPhoneAlt, FaSpinner } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";

const DashboardSupportPage = () => {
  const { user } = useUser();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both the subject and message.");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitSupportTicket(subject, message);
      toast.success("Support ticket submitted successfully. We'll get back to you shortly.");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to submit ticket. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-1 md:p-3 lg:p-4 gap-6 flex flex-col">
      <div className="border border-gray-200 rounded-md flex flex-col gap-2 md:gap-3 p-2 md:p-3 lg:p-4">
        <p className="text-sm lg:text-base font-semibold">How can we help you today?</p>
        <div className="border border-gray-200 rounded-md flex flex-col gap-2 md:gap-3 p-2 md:p-3 lg:p-4">
          <div className="flex gap-4">
            <BsChatFill className="text-bgBlue text-xl lg:text-2xl" />
            <p className="text-sm lg:text-base font-semibold">Live Chat</p>
          </div>
          <p className="text-xs text-gray-600">Get Instant help from our support team</p>
          <p className="text-xs text-red-400">Unavailable</p>
        </div>
        <a href="tel:+2347034194669">
          <div className="border border-gray-200 rounded-md flex flex-col gap-2 md:gap-3 p-2 md:p-3 lg:p-4">
            <div className="flex gap-4">
              <FaPhoneAlt className="text-bgBlue text-xl lg:text-2xl" />
              <p className="text-sm lg:text-base font-semibold">Phone Support</p>
            </div>
            <p className="text-xs text-gray-600">Call us at +234 703 419 4669</p>
            <p className="text-xs text-green-400">Available now</p>
          </div>
        </a>
        <a href="mailto:support@bluesandstemlabs.com">
          <div className="border border-gray-200 rounded-md flex flex-col gap-2 md:gap-3 p-2 md:p-3 lg:p-4">
            <div className="flex gap-4">
              <MdEmail className="text-bgBlue text-xl lg:text-2xl" />
              <p className="text-sm lg:text-base font-semibold">Email Support</p>
            </div>
            <p className="text-xs text-gray-600">Send us your questions anytime</p>
            <p className="text-xs text-green-400">Available now</p>
          </div>
        </a>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-md gap-2 md:gap-3 p-2 md:p-3 lg:p-4">
        <p className="text-sm lg:text-base font-semibold">Submit a Support Request</p>

        <div className="mt-3 md:mt-6 flex flex-col gap-2">
          <label htmlFor="name" className="text-xs font-semibold">Name</label>
          <input
            type="text"
            id="name"
            value={user?.fullName ?? ""}
            readOnly
            className="border border-gray-300 rounded-md p-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div className="mt-3 md:mt-6 flex flex-col gap-2">
          <label htmlFor="email" className="text-xs font-semibold">Email</label>
          <input
            type="email"
            id="email"
            value={user?.email ?? ""}
            readOnly
            className="border border-gray-300 rounded-md p-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>

        <div className="mt-3 md:mt-6 flex flex-col gap-2">
          <label htmlFor="subject" className="text-xs font-semibold">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Subject of issue"
            required
          />
        </div>

        <div className="mt-3 md:mt-6 flex flex-col gap-2">
          <label htmlFor="message" className="text-xs font-semibold">Message</label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Please describe your issue or question in detail..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-3 md:mt-6 bg-bgBlue text-white w-full p-2 text-sm lg:text-base rounded flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <><FaSpinner className="animate-spin" /> Submitting...</> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default DashboardSupportPage;
