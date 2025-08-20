import React from 'react';

interface TypingIndicatorProps {
  typingUsers: Set<string>;
  userNames?: Map<string, string>;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers, userNames }) => {
  if (typingUsers.size === 0) return null;

  const typingUserNames = Array.from(typingUsers).map(userId => 
    userNames?.get(userId) || 'Someone'
  );

  const displayText = typingUserNames.length === 1 
    ? `${typingUserNames[0]} is typing...`
    : `${typingUserNames.slice(0, -1).join(', ')} and ${typingUserNames[typingUserNames.length - 1]} are typing...`;

  return (
    <div className="flex items-center space-x-2 p-3 text-gray-500 text-sm">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-gray-500">{displayText}</span>
    </div>
  );
};

export default TypingIndicator;
