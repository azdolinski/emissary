import React from "react";

interface InsertPageLinkButtonProps {
  pageName: string;
  pageUrl: string;
  setTextBoxMessage: React.Dispatch<React.SetStateAction<string>>;
}

const InsertPageLinkButton: React.FC<InsertPageLinkButtonProps> = ({
  pageName,
  pageUrl,
  setTextBoxMessage,
}) => {
  const insertPageLink = () => {
    const link = `[${pageName}](${pageUrl})`;
    setTextBoxMessage((prevMessage) => {
      const textarea = document.getElementById('textBoxMessage') as HTMLTextAreaElement;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = prevMessage.substring(0, cursorPosition);
      const textAfterCursor = prevMessage.substring(cursorPosition);
      const newMessage = `${textBeforeCursor}${link}${textAfterCursor}`;
      
      // Set cursor position after the inserted link
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = cursorPosition + link.length;
        textarea.focus();
      }, 0);

      return newMessage;
    });
  };

  return (
    <button
      className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 p-2 rounded ml-2"
      onClick={insertPageLink}
      title="Insert Page Link"
    >
      <svg
        data-name="Layer 1"
        viewBox="0 0 24 24"
        fill="currentColor"
        height="2em"
        width="2em"
      >
        <path d="M12.11 15.39l-3.88 3.88a2.47 2.47 0 01-3.5 0 2.46 2.46 0 010-3.5l3.88-3.88a1 1 0 10-1.42-1.42l-3.88 3.89a4.48 4.48 0 006.33 6.33l3.89-3.88a1 1 0 00-1.42-1.42zm-3.28-.22a1 1 0 00.71.29 1 1 0 00.71-.29l4.92-4.92a1 1 0 10-1.42-1.42l-4.92 4.92a1 1 0 000 1.42zM21 18h-1v-1a1 1 0 00-2 0v1h-1a1 1 0 000 2h1v1a1 1 0 002 0v-1h1a1 1 0 000-2zm-4.19-4.47l3.88-3.89a4.48 4.48 0 00-6.33-6.33l-3.89 3.88a1 1 0 101.42 1.42l3.88-3.88a2.47 2.47 0 013.5 0 2.46 2.46 0 010 3.5l-3.88 3.88a1 1 0 000 1.42 1 1 0 001.42 0z" />
      </svg>
    </button>
  );
};

export default InsertPageLinkButton;
