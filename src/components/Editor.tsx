import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

// Toolbar config 
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // text styles
  [{ header: [1, 2, 3, 4, false] }],         // headers
  [{ list: "ordered" }, { list: "bullet" }], // lists
  ["link", "image", "video", "blockquote", "code"], // links & media
  [{ align: [] }],                           // text alignment
  [{ script: "sub" }, { script: "super" }],  // subscript/superscript
];

const Editor = forwardRef<
  Quill,
  {
    readOnly?: boolean;
    defaultValue?: any;
    onTextChange?: (...args: any[]) => void;
    onSelectionChange?: (...args: any[]) => void;
  }
>(({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultValueRef = useRef(defaultValue);
  const onTextChangeRef = useRef(onTextChange);
  const onSelectionChangeRef = useRef(onSelectionChange);

  useLayoutEffect(() => {
    onTextChangeRef.current = onTextChange;
    onSelectionChangeRef.current = onSelectionChange;
  });

  useEffect(() => {
    (ref as any).current?.enable(!readOnly);
  }, [ref, readOnly]);

  useEffect(() => {
    const container = containerRef.current!;

    // Create editor container
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div")
    );

    // Create Quill with toolbar
    const quill = new Quill(editorContainer, {
      theme: "snow",
      modules: {
        toolbar: toolbarOptions,
      },
      readOnly,
    });

    (ref as any).current = quill;

    if (defaultValueRef.current) {
      quill.setContents(defaultValueRef.current);
    }

    quill.on(Quill.events.TEXT_CHANGE, (...args) => {
      onTextChangeRef.current?.(...args);
    });

    quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
      onSelectionChangeRef.current?.(...args);
    });

    return () => {
      (ref as any).current = null;
      container.innerHTML = "";
    };
  }, [ref, readOnly]);

  return <div ref={containerRef}></div>;
});

Editor.displayName = "Editor";

export default Editor;
