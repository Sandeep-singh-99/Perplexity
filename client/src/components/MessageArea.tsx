import React from "react";

const PremiumTypingAnimation = () => (
  <div className="flex items-center">
    <div className="flex items-center space-x-1.5">
      {[0, 300, 600].map((delay) => (
        <div
          key={delay}
          className="w-1.5 h-1.5 bg-gray-400/70 rounded-full animate-pulse"
          style={{ animationDuration: "1s", animationDelay: `${delay}ms` }}
        ></div>
      ))}
    </div>
  </div>
);

const SearchStages = ({ searchInfo }) => {
  if (!searchInfo?.stages?.length) return null;

  return (
    <div className="mb-3 mt-1 relative pl-4">
      <div className="flex flex-col space-y-4 text-sm text-gray-700">
        {/* Searching */}
        {searchInfo.stages.includes("searching") && (
          <div className="relative">
            <div className="absolute -left-3 top-1 w-2.5 h-2.5 bg-teal-400 rounded-full"></div>
            {searchInfo.stages.includes("reading") && (
              <div className="absolute -left-[7px] top-3 w-0.5 h-[calc(100%+1rem)] bg-gradient-to-b from-teal-300 to-teal-200"></div>
            )}
            <div className="flex flex-col">
              <span className="font-medium mb-2 ml-2">Searching the web</span>
              <div className="flex flex-wrap gap-2 pl-2 mt-1">
                <div className="bg-gray-100 text-xs px-3 py-1.5 rounded border border-gray-200 inline-flex items-center">
                  <svg
                    className="w-3 h-3 mr-1.5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {searchInfo.query}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reading */}
        {searchInfo.stages.includes("reading") && (
          <div className="relative">
            <div className="absolute -left-3 top-1 w-2.5 h-2.5 bg-teal-400 rounded-full"></div>
            <div className="flex flex-col">
              <span className="font-medium mb-2 ml-2">Reading</span>
              <div className="pl-2 space-y-1">
                <div className="flex flex-wrap gap-2">
                  {searchInfo.urls?.map((url, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 text-xs px-3 py-1.5 rounded border border-gray-200 truncate max-w-[200px] hover:bg-gray-50"
                    >
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Writing */}
        {searchInfo.stages.includes("writing") && (
          <div className="relative">
            <div className="absolute -left-3 top-1 w-2.5 h-2.5 bg-teal-400 rounded-full"></div>
            <span className="font-medium pl-2">Writing answer</span>
          </div>
        )}

        {/* Error */}
        {searchInfo.stages.includes("error") && (
          <div className="relative">
            <div className="absolute -left-3 top-1 w-2.5 h-2.5 bg-red-400 rounded-full"></div>
            <span className="font-medium">Search error</span>
            <div className="pl-4 text-xs text-red-500 mt-1">
              {searchInfo.error || "An error occurred during search."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageArea = ({ messages }) => (
  <div className="flex-grow overflow-y-auto bg-[#FCFCF8] border-b border-gray-100 min-h-0">
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.isUser ? "justify-end" : "justify-start"
          } mb-4 sm:mb-5`}
        >
          <div className="flex flex-col max-w-[85%] sm:max-w-md">
            {!message.isUser && message.searchInfo && (
              <SearchStages searchInfo={message.searchInfo} />
            )}
            <div
              className={`rounded-lg py-2.5 px-4 sm:py-3 sm:px-5 text-sm sm:text-base ${
                message.isUser
                  ? "bg-gradient-to-br from-[#5E507F] to-[#4A3F71] text-white rounded-br-none shadow-md"
                  : "bg-[#F3F3EE] text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
              }`}
            >
              {message.isLoading ? (
                <PremiumTypingAnimation />
              ) : (
                message.content || (
                  <span className="text-gray-400 text-xs italic">
                    Waiting for response...
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MessageArea;
