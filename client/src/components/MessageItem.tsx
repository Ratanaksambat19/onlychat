import React from 'react';

interface ChatMessageItemProps {
  message: {
    username: string;
    text: string;
  };
  isCurrentUser: boolean;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isCurrentUser }) => {
  const { username, text } = message;
  const displayUsername = isCurrentUser ? 'You' : username;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
        width: '90%',
      }}
    >
      <div
        style={{
          color: isCurrentUser ? 'blue' : 'black',
          padding: '8px',
          marginBottom: '4px',
        }}
      >
        {displayUsername}
      </div>
      <div
        style={{
          backgroundColor: isCurrentUser ? '#38B6FF' : '#E2E2E2',
          color: isCurrentUser ? 'white' : 'black',
          borderRadius: '5px',
          padding: '8px',
          wordWrap: 'break-word',
          maxWidth: '80%',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessageItem;
