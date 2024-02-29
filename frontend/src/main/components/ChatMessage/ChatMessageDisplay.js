import React from 'react';
import Card from 'react-bootstrap/Card';

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  return formattedDate;
}

function ChatMessageDisplay({ chatMessage }) {
  return (
    <Card data-testid="ChatMessageDisplay">
      <Card.Body>
        <Card.Text>
          Email: {chatMessage.email}
        </Card.Text>
        <Card.Subtitle className="mb-2 text-muted">{formatTimestamp(chatMessage.chatMessage.timestamp)}</Card.Subtitle>
        <Card.Title>{chatMessage.chatMessage.payload}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export default ChatMessageDisplay;

