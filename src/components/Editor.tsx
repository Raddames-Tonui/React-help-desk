import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Icon from "../utilities/Icon";
import "../css/tiptap.css";


interface EditorProps {
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (html: string) => void;
}

const Editor: React.FC<EditorProps> = ({ name, onChange, value }) => {
  const editor = useEditor({
    extensions: [

      StarterKit.configure({
        link: false,   // disable built-in
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,   // don’t open links when clicked
        autolink: true,       // auto-detect URLs
        linkOnPaste: true,    // paste → auto-convert to link
        protocols: ["http", "https", "mailto"], // allowed protocols
        HTMLAttributes: {
          class: "tiptap-link", // your custom CSS class
          target: "_blank",     // default open in new tab
          rel: "noopener noreferrer nofollow",
        },
      }),
      Image,
      Youtube,
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    }
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor])

  if (!editor) return null;

  return (
    <div className="tiptap-wrapper">
      <div className="tiptap-toolbar">
        {/* Text styles */}
        <div className="toolbar-group">       
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "active" : ""}
          >
            <Icon iconName="bold" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "active" : ""}
          >
            <Icon iconName="italic" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={editor.isActive("underline") ? "active" : ""}
          >
            <Icon iconName="underline" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "active" : ""}
          >
            <Icon iconName="strikethrough" />
            </button>
        </div>

        {/* Headings */}
        <div className="toolbar-group"> 
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? "active" : ""}
          >
            <Icon iconName="h1" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
          >
            <Icon iconName="h2" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? "active" : ""}
          >
            <Icon iconName="h3" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} 
            className={editor.isActive("heading", { level: 4 }) ? "active" : ""}
          >
            <Icon iconName="h4" />
          </button>
        </div>


        {/* Lists */}
        <div className="toolbar-group"> 
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "active" : ""}
          >
            <Icon iconName="list" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "active" : ""}
          >
            <Icon iconName="numberedList" />
          </button>
        </div>

        {/* Links & Media */}
        <div className="toolbar-group"> 
          <button
            onClick={() => {
              const url = window.prompt("Enter link URL");
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className={editor.isActive("link") ? "active" : ""}
          >
            <Icon iconName="link" />
          </button>
          <button
            onClick={() => {
              const url = window.prompt("Enter image URL");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
          >
            <Icon iconName="image" />
          </button>
          <button
            onClick={() => {
              const url = window.prompt("Enter YouTube video URL");
              if (url) editor.commands.setYoutubeVideo({ src: url });
            }}
          >
            <Icon iconName="youtube" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "active" : ""}
          >
            <Icon iconName="quote" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? "active" : ""}
          >
            <Icon iconName="code" />
            </button>
        </div>

        {/* Alignment */}
        <div className="toolbar-group"> 
            <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
              <Icon iconName="alignLeft" />
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
              <Icon iconName="alignCenter" />
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
              <Icon iconName="alignRight" />
            </button>
        </div>

        {/* Subscript / Superscript */}
        <div className="toolbar-group"> 
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={editor.isActive("superscript") ? "active" : ""}
            >
              <Icon iconName="superScript" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={editor.isActive("subscript") ? "active" : ""}
            >
              <Icon iconName="subscript" />
              </button>
        </div>
      </div>

      <EditorContent editor={editor} />

      <textarea
        name={name}
        style={{ display: "none" }}
        value={value}
        readOnly
      />
    </div>
  );
};

export default Editor;
