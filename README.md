# Nexis AI

Intelligent, minimal AI companion powered by Google Gemini.

## Live Demo

- [nexis-ai-teal.vercel.app](https://nexis-ai-teal.vercel.app)

## About the Project

Nexis is a lightweight AI chat application designed for fast, focused conversations with an LLM. The app gives users a clean chat interface, supports both guest and authenticated sessions, and keeps conversation history in a way that feels natural for a personal productivity or portfolio project.

The app was built to provide a simple but useful AI assistant experience: users can ask questions, get structured responses, and maintain ongoing conversations without leaving the interface. The main purpose is to make a modern chat experience that feels polished, responsive, and easy to use while demonstrating real integration with Clerk authentication, Supabase persistence, and the Gemini API.

## Features

- Real-time AI chat responses streamed from Google Gemini
- Multi-turn conversation history with context retained in a single chat flow
- Conversation list with search, rename, and delete support for authenticated users
- Guest mode with a limit before sign-in is required
- Guest-to-auth migration of conversation data
- Responsive sidebar layout for desktop and mobile screens
- Light/dark theme switching
- Markdown rendering with styled code blocks and syntax highlighting
- Clerk-based sign-in and sign-up flow

## Tech Stack

- Languages: TypeScript, JavaScript
- Framework: Next.js 16.3.1, React 19.2.8
- Styling: Tailwind CSS 4
- State management: Zustand
- Authentication: Clerk
- Database: Supabase
- AI API: Google Generative AI (Gemini 3.1 Flash Lite)
- Markdown and rendering: react-markdown, remark-gfm
- Syntax highlighting: react-syntax-highlighter
- Icons: lucide-react
- Theme support: next-themes

## How It Works

1. The user opens the app and starts a conversation from the landing chat screen.
2. `app/page.tsx` renders the main chat UI, and the `useChat` hook manages all sending and streaming logic.
3. When a message is sent, the app pushes the message into the Zustand store and creates a conversation ID if needed.
4. The front end sends the message history to `/api/chat`.
5. The Next.js route in `app/api/chat/route.ts` calls the Gemini SDK with a system instruction and streams the response back to the browser.
6. As chunks arrive, the app updates the assistant message in real time so the response appears progressively.
7. For signed-in users, conversation and message data are persisted in Supabase using the helpers in `lib/supabase.ts`.
8. For guest users, messages are stored in `sessionStorage` and are limited by the guest session logic in `hooks/useGuestSession.ts`.
9. The UI, sidebar, theming, and conversation state are coordinated through Zustand stores and the app layout components.

## Project Structure

```
nexis-ai/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx    # Clerk sign-in page
│   │   └── sign-up/[[...sign-up]]/page.tsx    # Clerk sign-up page
│   ├── api/
│   │   └── chat/route.ts                      # Gemini streaming API route
│   ├── chat/[id]/page.tsx                     # Dynamic chat page for a specific conversation
│   ├── globals.css                            # Global styles and theme tokens
│   ├── layout.tsx                             # Root layout with Clerk + theme + sidebar shell
│   └── page.tsx                               # Initial chat page
├── components/
│   ├── chat/
│   │   ├── ChatInput.tsx                      # Message composer with submit and auto-resize
│   │   ├── CodeBlock.tsx                      # Syntax-highlighted code block renderer
│   │   ├── EmptyState.tsx                     # Welcome state for the first screen
│   │   ├── MarkdownRenderer.tsx               # Markdown formatting for AI answers
│   │   ├── MessageItem.tsx                    # Individual message bubble
│   │   └── MessageList.tsx                    # Scrollable list of conversation messages
│   ├── layout/
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx                    # Collapsible sidebar
│   │   │   ├── SidebarHeader.tsx              # Sidebar branding and states
│   │   │   ├── SidebarSearch.tsx              # Search/filter UI
│   │   │   ├── ConversationList.tsx           # List of saved conversations
│   │   │   ├── NewChatButton.tsx              # New chat trigger
│   │   │   └── SidebarUser.tsx                # User info area
│   │   └── Topbar.tsx                         # Conversation title and mobile controls
│   └── providers/
│       ├── GuestSessionGuard.tsx              # Guest session gating logic
│       ├── ThemeProvider.tsx                  # next-themes wrapper
│       └── ThemeToggleButton.tsx              # Theme toggle button
├── hooks/
│   ├── useChat.ts                             # Chat send/load logic and streaming
│   ├── useConversations.ts                    # Fetch/delete/rename conversation actions
│   └── useGuestSession.ts                     # Guest limit and migration logic
├── lib/
│   ├── clerkTheme.ts                          # Custom Clerk theme styling
│   └── supabase.ts                            # Supabase client and database helpers
├── public/
│   ├── favicon.ico                            # App favicon
│   ├── full-nexis-dark-theme-logo.png         # Dark logo asset
│   ├── full-nexis-light-theme-logo.png        # Light logo asset
│   └── nexis-logo.png                         # Core app logo
├── store/
│   ├── useChatStore.ts                        # Chat and conversation state
│   └── useUIStore.ts                          # Sidebar and UI state
├── types/
│   └── index.ts                               # Shared TypeScript interfaces
├── AGENTS.md                                  # Local project instructions
├── CLAUDE.md                                  # Claude-specific notes
├── README.md                                  # Project documentation
├── eslint.config.mjs                          # ESLint configuration
├── next.config.ts                             # Next.js config
├── package.json                               # Scripts and dependencies
├── package-lock.json                          # Locked dependency tree
├── postcss.config.mjs                         # PostCSS configuration
├── proxy.ts                                   # Proxy-related helper file
├── tsconfig.json                              # TypeScript config
└── .gitignore                                 # Git ignore rules
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm installed
- A Google AI Studio API key for Gemini
- A Supabase project with a public URL and anonymous key
- A Clerk project with publishable and secret keys

### 1) Clone the repository

```bash
git clone https://github.com/debyendu03/nexis-ai.git
cd nexis-ai
```

### 2) Install dependencies

```bash
npm install
```

### 3) Create `.env.local`

Create a file named `.env.local` in the project root with the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up 
```

What each variable is used for:

- `NEXT_PUBLIC_SUPABASE_URL`: Base URL for the Supabase project used by `lib/supabase.ts`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key for reading and writing data through the Supabase client
- `GEMINI_API_KEY`: API key used by `app/api/chat/route.ts` to call Gemini
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Public key required by `@clerk/nextjs`
- `CLERK_SECRET_KEY`: Secret key required by Clerk backend authentication flows
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: Clerk sign-in route used by the app's auth pages
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: Clerk sign-up route used by the app's auth pages 

### 4) Run the app in development mode

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### 5) Production build

```bash
npm run build
npm start
```

## Available Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the Next.js development server for local development |
| `npm run build` | Creates a production build of the app |
| `npm start` | Runs the production build locally |
| `npm run lint` | Runs ESLint for code quality checks |

## Author

**Debyendu Biswas**
- GitHub: [@debyendu03](https://github.com/debyendu03)
- LinkedIn: [debyendu03](https://www.linkedin.com/in/debyendu03)
- Mail: [debyendu03@gmail.com](mailto:debyendu03@gmail.com)

