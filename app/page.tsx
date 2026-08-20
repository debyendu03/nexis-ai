"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUp, ChevronDown, Clock3, Code2, FileText, Folder,
  ImagePlus, Menu, MessageSquare, Moon, Paperclip, PenLine, Plus, Search,
  Settings, Sparkles, Sun, X,
} from "lucide-react";

const chats = [
  { label: "Project Alpha", icon: Folder, active: true },
  { label: "Market research", icon: FileText },
  { label: "Code review", icon: Code2 },
  { label: "Project compet...", icon: MessageSquare, detail: "2 recent" },
  { label: "Recent mesar b...", icon: Clock3, detail: "2 recent" },
];

export default function Home() {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setMessage("");
  }

  return (
    <main className={`chat-shell ${dark ? "theme-dark" : "theme-light"}`}>
      <aside className={`chat-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <div className="window-dots" aria-hidden="true">
            <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
          </div>
          <button className="mobile-close icon-button" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><X size={18} /></button>
          <div className="brand">
            <div className="brand-mark"><span /><span /><span /></div>
            <div><strong>Axon</strong><small>Think sharper</small></div>
          </div>
          <button className="new-chat" onClick={() => setSent(false)}><Plus size={18} /> New Chat</button>
          <label className="search-box"><Search size={16} /><input placeholder="Search" aria-label="Search chats" /></label>
        </div>
        <nav className="chat-list" aria-label="Conversations">
          {chats.map(({ label, icon: Icon, active, detail }) => (
            <button className={`chat-link ${active ? "active" : ""}`} key={label}>
              <Icon size={15} /><span>{label}</span>{detail && <small>{detail}</small>}
            </button>
          ))}
        </nav>
        <button className="profile"><span className="avatar">DD</span><span>Dip</span><ChevronDown size={16} /></button>
      </aside>

      <section className="chat-main">
        <header className="chat-header">
          <button className="mobile-menu icon-button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><Menu size={20} /></button>
          <h1>Explain quantum theory</h1>
          <div className="header-actions">
            <button className="icon-button" aria-label="Settings"><Settings size={18} /></button>
            <button className="icon-button theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          </div>
        </header>
        <div className="conversation">
          <article className="message assistant"><Sparkles className="message-icon" size={21} /><p>Explain quantum theory is a <strong>conspendous</strong> generating c nmitter, instancespane theory and solvian steereed entitles more negation indiation. and itassise coramxatac;and community bistymetrs. ad each proctection and normer compitive auameatiry.</p></article>
          <div className="message-meta assistant-meta">12:18 9M</div>
          <article className="message user"><p>How nuny you th secamnid quastum:<br />theory thes?</p></article>
          <div className="message-meta user-meta">12:45 PM</div>
          <div className="conversation-rule"><span>Conversation</span></div>
          <article className="message assistant"><Sparkles className="message-icon" size={21} /><p>The rnormaation part in the nonifaced method : som:hing assuming osameoptions, encagmanarily clost to orsseleetion or conversd/deoral prodiant and more paribulation.</p></article>
          {sent && <article className="message user"><p>Thanks, that helps clarify it.</p></article>}
        </div>
        <form className="composer-wrap" onSubmit={submitMessage}>
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} aria-label="Message Axon" rows={1} />
          <div className="composer-actions">
            <button type="button" className="icon-button" aria-label="Add image"><ImagePlus size={18} /></button>
            <div className="composer-right">
              <button type="button" className="icon-button" aria-label="Attach file"><Paperclip size={18} /></button>
              <button type="button" className="icon-button" aria-label="Edit"><PenLine size={18} /></button>
              <button className="send-button" aria-label="Send message"><ArrowUp size={19} /></button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
