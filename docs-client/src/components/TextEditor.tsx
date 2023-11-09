import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { DeltaStatic, Sources } from "quill";
import "react-quill/dist/quill.snow.css";
import { io, Socket } from "socket.io-client";

const INTERVAL_TRIGGER_TIME = 3000;

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor: React.FC = () => {
  const [value, setValue] = useState("");
  const [socket, setSocket] = useState<Socket>();
  const quillRef = useRef<ReactQuill>(null);
  const { id: documentId } = useParams();

  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
    socket.on("recive-quill-changes", updateQuillWithSocket);
    return () => {
      socket.off("recive-quill-changes", updateQuillWithSocket);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!quillRef.current || !socket) return;
    const quill = quillRef.current;
    quill.getEditor().disable();
    quill.getEditor().setText("Loading...");

    socket.once("load-document", (document) => {
      quillRef.current?.getEditor().setContents(document);
      quillRef.current?.getEditor().enable();
    });

    socket.emit("get-document", documentId);

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getEditor().getContents());
    }, INTERVAL_TRIGGER_TIME);

    return () => clearInterval(interval);
  }, [socket, documentId, quillRef.current]);

  function updateQuillWithSocket(delta: DeltaStatic) {
    quillRef.current?.getEditor().updateContents(delta);
  }

  const onQuillChage = (value: string, delta: DeltaStatic, source: Sources) => {
    if (source !== "user") return;
    setValue(value);
    socket?.emit("emit-quill-changes", delta);
  };

  return (
    <ReactQuill
      modules={{ toolbar: TOOLBAR_OPTIONS }}
      theme="snow"
      value={value}
      onChange={onQuillChage}
      ref={quillRef}
    />
  );
};

export default TextEditor;
