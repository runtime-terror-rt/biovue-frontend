"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Highlighter,
  Undo2,
  Redo2,
  RemoveFormatting,
  Link2,
  ChevronDown,
  Palette,
} from "lucide-react";

interface WordEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const TEXT_COLORS = [
  { name: "Default (Dark)", value: "#041228" },
  { name: "Muted Gray", value: "#64748B" },
  { name: "BioVue Teal", value: "#0FA4A9" },
  { name: "Royal Blue", value: "#3A86FF" },
  { name: "Emerald Green", value: "#10B981" },
  { name: "Crimson Red", value: "#EF4444" },
  { name: "Amber Orange", value: "#F59E0B" },
];

const HIGHLIGHT_COLORS = [
  { name: "None", value: "transparent" },
  { name: "Yellow", value: "#FEF08A" },
  { name: "Soft Teal", value: "#CCFBF1" },
  { name: "Soft Blue", value: "#DBEAFE" },
  { name: "Soft Rose", value: "#FFE4E6" },
  { name: "Soft Green", value: "#DCFCE7" },
];

export default function WordEditor({
  value,
  onChange,
  placeholder = "Start typing or customize text like Microsoft Word...",
  minHeight = "220px",
}: WordEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [currentBlock, setCurrentBlock] = useState("p");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const isUpdatingRef = useRef(false);

  // Sync value from props only when not self-triggered
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
        updateStats();
      }
    }
    isUpdatingRef.current = false;
  }, [value]);

  const updateStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || "";
    const trimmed = text.trim();
    setWordCount(trimmed ? trimmed.split(/\s+/).length : 0);
    setCharCount(text.length);
  };

  const execute = (command: string, arg: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    const html = editorRef.current.innerHTML;
    updateStats();
    onChange(html);
  };

  const handleBlockChange = (tag: string) => {
    setCurrentBlock(tag);
    if (tag === "blockquote") {
      execute("formatBlock", "blockquote");
    } else if (tag === "p") {
      execute("formatBlock", "<p>");
    } else {
      execute("formatBlock", `<${tag}>`);
    }
  };

  const handleAddLink = () => {
    const url = prompt("Enter URL link (e.g. https://example.com):");
    if (url) {
      execute("createLink", url);
    }
  };

  const handleTextColor = (color: string) => {
    execute("foreColor", color);
    setShowColorPicker(false);
  };

  const handleHighlightColor = (color: string) => {
    if (color === "transparent") {
      execute("removeFormat");
    } else {
      execute("hiliteColor", color);
    }
    setShowHighlightPicker(false);
  };

  return (
    <div className="border border-[#D9E6FF] rounded-2xl overflow-hidden bg-white shadow-sm focus-within:border-[#0FA4A9] transition-all">
      {/* Word Ribbon Toolbar */}
      <div className="bg-[#F8FBFA] border-b border-[#E8EFF8] p-2 flex flex-wrap items-center gap-1 text-[#475569] select-none">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-[#E2E8F0]">
          <button
            type="button"
            title="Undo (Ctrl+Z)"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("undo");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer"
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            title="Redo (Ctrl+Y)"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("redo");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Text Style / Block Type */}
        <div className="pr-2 border-r border-[#E2E8F0]">
          <select
            value={currentBlock}
            onChange={(e) => handleBlockChange(e.target.value)}
            className="bg-white border border-[#D9E6FF] text-xs font-semibold rounded-lg px-2.5 py-1 text-[#041228] focus:outline-none focus:border-[#0FA4A9] cursor-pointer"
          >
            <option value="p">Normal Text</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="blockquote">Quote Callout</option>
          </select>
        </div>

        {/* Basic Formats */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-[#E2E8F0]">
          <button
            type="button"
            title="Bold (Ctrl+B)"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("bold");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer font-bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            title="Italic (Ctrl+I)"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("italic");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            title="Underline (Ctrl+U)"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("underline");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer underline"
          >
            <Underline size={16} />
          </button>
          <button
            type="button"
            title="Strikethrough"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("strikeThrough");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer line-through"
          >
            <Strikethrough size={16} />
          </button>
        </div>

        {/* Colors & Highlight */}
        <div className="flex items-center gap-1 pr-2 border-r border-[#E2E8F0] relative">
          {/* Text Color */}
          <div className="relative">
            <button
              type="button"
              title="Text Color"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Palette size={16} />
              <ChevronDown size={12} />
            </button>
            {showColorPicker && (
              <div className="absolute left-0 top-full mt-1.5 bg-white border border-[#D9E6FF] shadow-xl rounded-xl p-2 z-50 w-44 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-2 py-0.5">
                  Text Color
                </span>
                {TEXT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleTextColor(c.value)}
                    className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-[#F8FBFA] rounded-md transition-colors text-left"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-gray-200"
                      style={{ backgroundColor: c.value }}
                    />
                    <span style={{ color: c.value }} className="font-semibold">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Background Highlight */}
          <div className="relative">
            <button
              type="button"
              title="Text Highlight Color"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Highlighter size={16} />
              <ChevronDown size={12} />
            </button>
            {showHighlightPicker && (
              <div className="absolute left-0 top-full mt-1.5 bg-white border border-[#D9E6FF] shadow-xl rounded-xl p-2 z-50 w-40 flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] px-2 py-0.5">
                  Highlight Color
                </span>
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleHighlightColor(c.value)}
                    className="flex items-center gap-2 px-2 py-1 text-xs hover:bg-[#F8FBFA] rounded-md transition-colors text-left"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-sm border border-gray-300"
                      style={{ backgroundColor: c.value }}
                    />
                    <span className="font-semibold text-gray-700">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-[#E2E8F0]">
          <button
            type="button"
            title="Align Left"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("justifyLeft");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            title="Align Center"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("justifyCenter");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            title="Align Right"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("justifyRight");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer"
          >
            <AlignRight size={16} />
          </button>
          <button
            type="button"
            title="Justify"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("justifyFull");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer"
          >
            <AlignJustify size={16} />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-0.5 pr-2 border-r border-[#E2E8F0]">
          <button
            type="button"
            title="Bulleted List"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("insertUnorderedList");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            title="Numbered List"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("insertOrderedList");
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer"
          >
            <ListOrdered size={16} />
          </button>
        </div>

        {/* Links & Clear */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title="Insert Link"
            onMouseDown={(e) => {
              e.preventDefault();
              handleAddLink();
            }}
            className="p-1.5 hover:bg-white hover:text-[#0FA4A9] rounded-lg transition-colors cursor-pointer"
          >
            <Link2 size={16} />
          </button>
          <button
            type="button"
            title="Clear Formatting"
            onMouseDown={(e) => {
              e.preventDefault();
              execute("removeFormat");
            }}
            className="p-1.5 hover:bg-white hover:text-red-500 rounded-lg transition-colors cursor-pointer"
          >
            <RemoveFormatting size={16} />
          </button>
        </div>
      </div>

      {/* Document Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        style={{ minHeight }}
        className="p-4 sm:p-5 outline-none text-[#1F2D2E] text-sm sm:text-base leading-relaxed overflow-y-auto [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-[#041228] [&>h1]:mb-2 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[#041228] [&>h2]:mb-2 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-[#041228] [&>h3]:mb-1 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-[#0FA4A9] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-[#5F6F73] [&>blockquote]:my-2 [&>a]:text-[#0FA4A9] [&>a]:underline cursor-text"
        data-placeholder={placeholder}
      />

      {/* Word-like Status Bar */}
      <div className="bg-[#FAFDFD] border-t border-[#F1F5F9] px-4 py-1.5 flex items-center justify-between text-[11px] text-[#94A3B8] font-semibold">
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>
        <span className="text-[#0FA4A9] uppercase tracking-wider text-[10px] font-bold">
          Word Customization Mode
        </span>
      </div>
    </div>
  );
}
