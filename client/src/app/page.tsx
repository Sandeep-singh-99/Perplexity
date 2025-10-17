"use client";

import Header from "@/components/Header";
import InputBar from "@/components/InputBar";
import MessageArea from "@/components/MessageArea";
import React, { useState } from "react";

interface SearchInfo {
  stages: string[];
  query: string;
  urls: string[];
}

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  type: string;
  isLoading?: boolean;
  searchInfo?: SearchInfo;
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hi there, how can I help you?",
      isUser: false,
      type: "message",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [checkpointId, setCheckpointId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const newMessageId =
      messages.length > 0 ? Math.max(...messages.map((msg) => msg.id)) + 1 : 1;

    setMessages((prev) => [
      ...prev,
      {
        id: newMessageId,
        content: currentMessage,
        isUser: true,
        type: "message",
      },
    ]);

    const userInput = currentMessage;
    setCurrentMessage("");

    try {
      const aiResponseId = newMessageId + 1;
      setMessages((prev) => [
        ...prev,
        {
          id: aiResponseId,
          content: "",
          isUser: false,
          type: "message",
          isLoading: true,
          searchInfo: { stages: [], query: "", urls: [] },
        },
      ]);

      let url = `https://perplexity-latest-thfy.onrender.com/chat_stream/${encodeURIComponent(
        userInput
      )}`;
      if (checkpointId) {
        url += `?checkpoint_id=${encodeURIComponent(checkpointId)}`;
      }

      const eventSource = new EventSource(url);
      let streamedContent = "";
      let searchData: SearchInfo | null = null;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "checkpoint") setCheckpointId(data.checkpoint_id);
          else if (data.type === "content") {
            streamedContent += data.content;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiResponseId
                  ? { ...msg, content: streamedContent, isLoading: false }
                  : msg
              )
            );
          } else if (data.type === "search_start") {
            const newSearchInfo = {
              stages: ["searching"],
              query: data.query,
              urls: [],
            };
            searchData = newSearchInfo;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiResponseId
                  ? { ...msg, searchInfo: newSearchInfo }
                  : msg
              )
            );
          } else if (data.type === "search_results") {
            const urls =
              typeof data.urls === "string" ? JSON.parse(data.urls) : data.urls;
            const newSearchInfo = {
              stages: searchData
                ? [...searchData.stages, "reading"]
                : ["reading"],
              query: searchData?.query || "",
              urls,
            };
            searchData = newSearchInfo;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiResponseId
                  ? { ...msg, searchInfo: newSearchInfo }
                  : msg
              )
            );
          } else if (data.type === "end") {
            eventSource.close();
          }
        } catch (err) {
          console.error("Error parsing SSE data:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        eventSource.close();
      };
    } catch (error) {
      console.error("Error setting up EventSource:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageId + 1,
          content: "Sorry, there was an error connecting to the server.",
          isUser: false,
          type: "message",
          isLoading: false,
        },
      ]);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen py-4 sm:py-8 px-2 sm:px-4">
      <div className="w-full max-w-5xl bg-white flex flex-col rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[90vh] sm:h-[85vh]">
        <Header />
        <MessageArea messages={messages} />
        <InputBar
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Home;
