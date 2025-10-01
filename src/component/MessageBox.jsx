import { Flex } from "antd";
import React from "react";

function MessageBox({ message, sentByCurrentUser, name, time }) {
  return (
    <div
      className={`w-full h-fit mb-1 flex ${
        sentByCurrentUser ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`"h-fit max-w-[350px] ${
          sentByCurrentUser
            ? "bg-[var(--primary-color)]"
            : "bg-[var(--default-color)]"
        } px-2 py-3 rounded-b-xl"`}
      >
        <p className="text-[12px] text-gray-400">{name}</p>
        <p>{message} </p>
        <span className="text--[12px] text-gray-400">{time}</span>
      </div>
    </div>
  );
}

export default MessageBox;
