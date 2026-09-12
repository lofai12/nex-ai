import ReactMarkdown from 'react-markdown'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'nexChats'
const LEGACY_STORAGE_KEY = 'chatLog'

function createChat() {
    const now = Date.now()

    return {
        id: `chat-${now}-${Math.random().toString(36).slice(2, 8)}`,
        title: 'New conversation',
        createdAt: now,
        updatedAt: now,
        messages: [],
    }
}

function createTitle(text) {
    const clean = text.replace(/\s+/g, ' ').trim()

    if (!clean) {
        return 'New conversation'
    }

    return clean.length > 42
        ? `${clean.slice(0, 42).trim()}...`
        : clean
}

function sortChats(chats) {
    return [...chats].sort(
        (a, b) =>
            (b.updatedAt || b.createdAt || 0) -
            (a.updatedAt || a.createdAt || 0)
    )
}

function getChatGroup(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()

    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    )

    const chatDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    )

    const difference = Math.floor(
        (today - chatDay) / (1000 * 60 * 60 * 24)
    )

    if (difference === 0) return 'TODAY'
    if (difference === 1) return 'YESTERDAY'
    if (difference <= 7) return 'PREVIOUS 7 DAYS'

    return 'OLDER'
}

function ChatIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 3v-5.5A7.5 7.5 0 1 1 20 11.5Z" />
        </svg>
    )
}

function PlusIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M12 5v14M5 12h14" />
        </svg>
    )
}

function TrashIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M4 7h16" />
            <path d="M9 7V4h6v3" />
            <path d="M7 7l1 13h8l1-13" />
            <path d="M10 11v5M14 11v5" />
        </svg>
    )
}

function MenuIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
    )
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="m6 6 12 12M18 6 6 18" />
        </svg>
    )
}

function SendIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
        >
            <path d="m4 4 16 8-16 8 3.5-8L4 4Z" />
            <path d="M7.5 12H20" />
        </svg>
    )
}

function SparkIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
        >
            <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
            <path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
        </svg>
    )
}

function App() {
    const [chats, setChats] = useState([])
    const [activeChatId, setActiveChatId] = useState(null)
    const [userInput, setUserInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    const chatWindowRef = useRef(null)
    const inputRef = useRef(null)

    // Load saved history
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)

            if (saved) {
                const parsed = JSON.parse(saved)

                if (Array.isArray(parsed)) {
                    const validChats = parsed.filter(
                        (chat) =>
                            chat &&
                            Array.isArray(chat.messages) &&
                            chat.messages.length > 0
                    )

                    if (validChats.length > 0) {
                        const sorted = sortChats(validChats)

                        setChats(sorted)
                        setActiveChatId(sorted[0].id)

                        return
                    }
                }
            }

            // Migrate old chatLog format if it exists
            const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)

            if (legacy) {
                const parsedLegacy = JSON.parse(legacy)

                if (
                    Array.isArray(parsedLegacy) &&
                    parsedLegacy.length > 0
                ) {
                    const migrated = createChat()

                    const firstUserMessage = parsedLegacy.find(
                        (message) =>
                            message?.role === 'user' ||
                            message?.sender === 'user'
                    )

                    migrated.title = createTitle(
                        firstUserMessage?.content ||
                            firstUserMessage?.text ||
                            ''
                    )

                    migrated.messages = parsedLegacy
                        .map((message) => ({
                            role:
                                message?.role ||
                                (message?.sender === 'user'
                                    ? 'user'
                                    : 'bot'),
                            content:
                                message?.content ||
                                message?.text ||
                                '',
                        }))
                        .filter((message) => message.content)

                    migrated.updatedAt = Date.now()

                    if (migrated.messages.length > 0) {
                        setChats([migrated])
                        setActiveChatId(migrated.id)
                    }
                }
            }
        } catch (error) {
            console.error(
                'Failed to load chat history:',
                error
            )
        }
    }, [])

    // Save history
    useEffect(() => {
        try {
            const persistentChats = chats.filter(
                (chat) => chat.messages?.length > 0
            )

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(persistentChats)
            )
        } catch (error) {
            console.error(
                'Failed to save chat history:',
                error
            )
        }
    }, [chats])

    // Auto scroll
    useEffect(() => {
        const element = chatWindowRef.current

        if (!element) return

        requestAnimationFrame(() => {
            element.scrollTo({
                top: element.scrollHeight,
                behavior: 'smooth',
            })
        })
    }, [activeChatId, chats, loading])

    const activeChat = useMemo(
        () =>
            chats.find(
                (chat) => chat.id === activeChatId
            ) || null,
        [chats, activeChatId]
    )

    const groupedChats = useMemo(() => {
        const groups = {
            TODAY: [],
            YESTERDAY: [],
            'PREVIOUS 7 DAYS': [],
            OLDER: [],
        }

        sortChats(chats).forEach((chat) => {
            const group = getChatGroup(
                chat.updatedAt ||
                    chat.createdAt ||
                    Date.now()
            )

            if (!groups[group]) {
                groups[group] = []
            }

            groups[group].push(chat)
        })

        return groups
    }, [chats])

    // Start a blank conversation
    const createNewChat = () => {
        if (loading) return

        setActiveChatId(null)
        setUserInput('')
        setMobileSidebarOpen(false)

        requestAnimationFrame(() => {
            inputRef.current?.focus()
        })
    }

    // Open existing conversation
    const openChat = (chatId) => {
        if (loading) return

        setActiveChatId(chatId)
        setUserInput('')
        setMobileSidebarOpen(false)
    }

    // Delete one conversation
    const deleteChat = (chatId, event = null) => {
        event?.stopPropagation?.()

        if (loading) return

        const remaining = sortChats(
            chats.filter((chat) => chat.id !== chatId)
        )

        setChats(remaining)

        if (chatId === activeChatId) {
            setActiveChatId(
                remaining.length > 0
                    ? remaining[0].id
                    : null
            )
        }
    }

    // Delete current conversation
    const deleteActiveChat = () => {
        if (!activeChatId || loading) return

        deleteChat(activeChatId)
    }

    // Delete all conversations
    const deleteAllChats = () => {
        if (loading || chats.length === 0) return

        const confirmed = window.confirm(
            'Delete all conversation history?'
        )

        if (!confirmed) return

        setChats([])
        setActiveChatId(null)
        setUserInput('')

        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(LEGACY_STORAGE_KEY)
    }

    // Update one chat
    const updateChat = (chatId, updater) => {
        setChats((previousChats) =>
            sortChats(
                previousChats.map((chat) =>
                    chat.id === chatId
                        ? updater(chat)
                        : chat
                )
            )
        )
    }

    // Send message
    const sendMessage = async (event) => {
        event?.preventDefault?.()

        const trimmedInput = userInput.trim()

        if (!trimmedInput || loading) return

        setUserInput('')
        setLoading(true)

        const currentChatId =
            activeChatId ||
            `chat-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 8)}`

        const userMessage = {
            role: 'user',
            content: trimmedInput,
        }

        // IMPORTANT:
        // Build the conversation BEFORE adding the new user message.
        // This gives the backend the exact previous context.
        const existingChat = chats.find(
            (chat) => chat.id === currentChatId
        )

        const previousMessages =
            existingChat?.messages || []

        const apiMessages = [
            ...previousMessages
                .filter(
                    (message) =>
                        message?.role === 'user' ||
                        message?.role === 'assistant' ||
                        message?.role === 'bot'
                )
                .map((message) => ({
                    role:
                        message.role === 'bot'
                            ? 'assistant'
                            : message.role,
                    content: String(
                        message.content || ''
                    ),
                })),
            userMessage,
        ].filter((message) => message.content.trim())

        // Keep the local UI updated immediately
        setChats((previousChats) => {
            const exists = previousChats.some(
                (chat) => chat.id === currentChatId
            )

            if (!exists) {
                const now = Date.now()

                const newChat = {
                    id: currentChatId,
                    title: createTitle(trimmedInput),
                    createdAt: now,
                    updatedAt: now,
                    messages: [userMessage],
                }

                return sortChats([
                    ...previousChats,
                    newChat,
                ])
            }

            return sortChats(
                previousChats.map((chat) =>
                    chat.id === currentChatId
                        ? {
                              ...chat,
                              title:
                                  chat.messages.length ===
                                  0
                                      ? createTitle(
                                            trimmedInput
                                        )
                                      : chat.title,
                              updatedAt: Date.now(),
                              messages: [
                                  ...chat.messages,
                                  userMessage,
                              ],
                          }
                        : chat
                )
            )
        })

        if (!activeChatId) {
            setActiveChatId(currentChatId)
        }

        try {
            const response = await fetch(
                'http://localhost:8000/chat',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_message: trimmedInput,
                        messages: apiMessages,
                    }),
                }
            )

            let data = null

            try {
                data = await response.json()
            } catch {
                data = null
            }

            if (!response.ok) {
                const backendError =
                    data?.detail ||
                    data?.error ||
                    data?.message ||
                    `Server returned ${response.status}`

                throw new Error(
                    `${response.status}: ${backendError}`
                )
            }

            const botContent =
                data?.response ||
                data?.message ||
                data?.reply ||
                data?.content ||
                'NEX tidak menerima respons dari model.'

            const botMessage = {
                role: 'bot',
                content: String(botContent),
            }

            updateChat(currentChatId, (chat) => ({
                ...chat,
                updatedAt: Date.now(),
                messages: [
                    ...chat.messages,
                    botMessage,
                ],
            }))
        } catch (error) {
            console.error(
                'Chat request failed:',
                error
            )

            const errorMessage =
                error?.message || 'Unknown error'

            updateChat(currentChatId, (chat) => ({
                ...chat,
                updatedAt: Date.now(),
                messages: [
                    ...chat.messages,
                    {
                        role: 'error',
                        content: `Request failed: ${errorMessage}`,
                    },
                ],
            }))
        } finally {
            setLoading(false)

            requestAnimationFrame(() => {
                inputRef.current?.focus()
            })
        }
    }

    const handleInputKeyDown = (event) => {
        if (
            event.key === 'Enter' &&
            !event.shiftKey
        ) {
            event.preventDefault()
            sendMessage(event)
        }
    }

    const setSuggestion = (text) => {
        setUserInput(text)

        requestAnimationFrame(() => {
            inputRef.current?.focus()
        })
    }

    const renderHistoryGroup = (groupName) => {
        const items = groupedChats[groupName]

        if (!items || items.length === 0) {
            return null
        }

        return (
            <div
                className="history-group"
                key={groupName}
            >
                <div className="history-group-title">
                    {groupName}
                </div>

                <div className="history-items">
                    {items.map((chat) => (
                        <div
                            className={`history-item ${
                                chat.id === activeChatId
                                    ? 'active'
                                    : ''
                            }`}
                            key={chat.id}
                            onClick={() =>
                                openChat(chat.id)
                            }
                        >
                            <button
                                className="history-open"
                                type="button"
                            >
                                <span className="history-icon">
                                    <ChatIcon />
                                </span>

                                <span className="history-title">
                                    {chat.title}
                                </span>
                            </button>

                            <button
                                className="history-delete"
                                type="button"
                                aria-label="Delete conversation"
                                onClick={(event) =>
                                    deleteChat(
                                        chat.id,
                                        event
                                    )
                                }
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="app">
            {mobileSidebarOpen && (
                <button
                    className="mobile-overlay"
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() =>
                        setMobileSidebarOpen(false)
                    }
                />
            )}

            <aside
                className={`sidebar ${
                    mobileSidebarOpen
                        ? 'mobile-open'
                        : ''
                }`}
            >
                <div className="sidebar-inner">
                    <div className="sidebar-header">
                        <div className="brand">
                            <div className="brand-mark">
                                <SparkIcon />
                            </div>

                            <div className="brand-text">
                                <span className="brand-name">
                                    NEX
                                </span>

                                <span className="brand-subtitle">
                                    AI ASSISTANT
                                </span>
                            </div>
                        </div>

                        <button
                            className="mobile-close"
                            type="button"
                            aria-label="Close sidebar"
                            onClick={() =>
                                setMobileSidebarOpen(
                                    false
                                )
                            }
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <button
                        className="new-chat-button"
                        type="button"
                        onClick={createNewChat}
                    >
                        <PlusIcon />
                        <span>New chat</span>
                    </button>

                    <section className="history-section">
                        <div className="history-header">
                            <span>RECENT</span>

                            {chats.length > 0 && (
                                <button
                                    className="clear-history"
                                    type="button"
                                    onClick={
                                        deleteAllChats
                                    }
                                    disabled={loading}
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="history-list">
                            {renderHistoryGroup(
                                'TODAY'
                            )}

                            {renderHistoryGroup(
                                'YESTERDAY'
                            )}

                            {renderHistoryGroup(
                                'PREVIOUS 7 DAYS'
                            )}

                            {renderHistoryGroup(
                                'OLDER'
                            )}

                            {chats.length === 0 && (
                                <div className="history-empty">
                                    <ChatIcon />

                                    <span>
                                        No conversations
                                        yet
                                    </span>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="sidebar-bottom">
                        <div className="system-status">
                            <span className="status-dot" />

                            <div className="status-copy">
                                <span className="status-title">
                                    System online
                                </span>

                                <span className="status-detail">
                                    NEX is ready
                                </span>
                            </div>
                        </div>

                        <div className="user-card">
                            <div className="user-avatar">
                                L
                            </div>

                            <div className="user-copy">
                                <span className="user-name">
                                    Lofi
                                </span>

                                <span className="user-plan">
                                    Personal workspace
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="main">
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="mobile-menu"
                            type="button"
                            aria-label="Open sidebar"
                            onClick={() =>
                                setMobileSidebarOpen(
                                    true
                                )
                            }
                        >
                            <MenuIcon />
                        </button>

                        <div className="topbar-title">
                            {activeChat
                                ? activeChat.title
                                : 'New conversation'}
                        </div>
                    </div>

                    <div className="topbar-right">
                        <div className="connection-status">
                            <span className="connection-dot" />
                            <span>Online</span>
                        </div>

                        {activeChatId && (
                            <button
                                className="topbar-delete"
                                type="button"
                                aria-label="Delete current conversation"
                                onClick={
                                    deleteActiveChat
                                }
                                disabled={loading}
                            >
                                <TrashIcon />
                            </button>
                        )}
                    </div>
                </header>

                <section
                    className="chat-window"
                    ref={chatWindowRef}
                >
                    {!activeChat ||
                    activeChat.messages.length === 0 ? (
                        <div className="welcome-state">
                            <div className="welcome-icon">
                                <SparkIcon />
                            </div>

                            <h1>
                                What can I help you
                                with?
                            </h1>

                            <p>
                                Ask NEX anything. Write
                                code, analyze ideas,
                                troubleshoot problems,
                                or just think something
                                through.
                            </p>

                            <div className="suggestions">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSuggestion(
                                            'Explain how this code works step by step.'
                                        )
                                    }
                                >
                                    <span className="suggestion-icon">
                                        &lt;/&gt;
                                    </span>

                                    <span>
                                        Explain my code
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSuggestion(
                                            'Help me debug this code and explain what is wrong.'
                                        )
                                    }
                                >
                                    <span className="suggestion-icon">
                                        &lt;/&gt;
                                    </span>

                                    <span>
                                        Debug my code
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSuggestion(
                                            'Give me a clear plan to learn programming from zero.'
                                        )
                                    }
                                >
                                    <span className="suggestion-icon">
                                        ✦
                                    </span>

                                    <span>
                                        Create a learning
                                        plan
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSuggestion(
                                            'Help me brainstorm a useful software project.'
                                        )
                                    }
                                >
                                    <span className="suggestion-icon">
                                        ◇
                                    </span>

                                    <span>
                                        Brainstorm a
                                        project
                                    </span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="messages-container">
                            <div className="messages">
                                {activeChat.messages.map(
                                    (
                                        message,
                                        index
                                    ) => (
                                        <div
                                            className={`message-row ${
                                                message.role ===
                                                'user'
                                                    ? 'user-message'
                                                    : 'bot-message'
                                            }`}
                                            key={`${activeChat.id}-${index}`}
                                        >
                                            {message.role !==
                                                'user' && (
                                                <div className="message-avatar">
                                                    <SparkIcon />
                                                </div>
                                            )}

                                            <div className="message-content">
                                                <div className="message-label">
                                                    {message.role ===
                                                    'user'
                                                        ? 'You'
                                                        : message.role ===
                                                          'error'
                                                        ? 'NEX • Error'
                                                        : 'NEX'}
                                                </div>

                                                <div
                                                    className={`message-text ${
                                                        message.role ===
                                                        'error'
                                                            ? 'error-text'
                                                            : ''
                                                    }`}
                                                >
                                                    {
                                                        message.content
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}

                                {loading && (
                                    <div className="message-row bot-message">
                                        <div className="message-avatar">
                                            <SparkIcon />
                                        </div>

                                        <div className="message-content">
                                            <div className="message-label">
                                                NEX
                                            </div>

                                            <div className="typing-indicator">
                                                <span />
                                                <span />
                                                <span />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                <div className="composer-area">
                    <form
                        className="composer"
                        onSubmit={sendMessage}
                    >
                        <textarea
                            ref={inputRef}
                            value={userInput}
                            onChange={(event) =>
                                setUserInput(
                                    event.target.value
                                )
                            }
                            onKeyDown={
                                handleInputKeyDown
                            }
                            placeholder="Message NEX..."
                            rows={1}
                            disabled={loading}
                        />

                        <button
                            className="send-button"
                            type="submit"
                            aria-label="Send message"
                            disabled={
                                loading ||
                                !userInput.trim()
                            }
                        >
                            <SendIcon />
                        </button>
                    </form>

                    <div className="composer-hint">
                        NEX can make mistakes. Check
                        important information.
                    </div>
                </div>
            </main>
        </div>
    )
}

export default App