import { useState } from "react";
import { api } from "../../api/client";

interface Campaign {
    id: string;
    name: string;
}

interface Conversation {
    id: string;
    campaignId: string;
    leadPhone: string;
    startedAt: string;
}

interface Message {
    id: string;
    conversationId: string;
    content: string;
    direction: number;
    sentAtUtc: string;
}

export default function CampaignBuilder() {
    const [campaignName, setCampaignName] = useState("");
    const [campaignError, setCampaignError] = useState("");

    const [campaign, setCampaign] = useState<Campaign | null>(null);

    const [leadPhone, setLeadPhone] = useState("");
    const [conversationError, setConversationError] = useState("");
    const [conversation, setConversation] = useState<Conversation | null>(null);

    const [content, setContent] = useState("");
    const [messageError, setMessageError] = useState("");
    const [direction, setDirection] = useState<number>(1);
    const [messages, setMessages] = useState<Message[]>([]);

    // ---------------- CREATE CAMPAIGN ----------------
    const createCampaign = async () => {
        if (!campaignName.trim()) {
            setCampaignError("Campaign name is required.");
            return;
        }

        setCampaignError("");

        const res = await api.post("/campaigns", { name: campaignName });

        setCampaign(res.data);
        setCampaignName("");
    };

    // ---------------- CREATE CONVERSATION ----------------
    const createConversation = async () => {
        if (!leadPhone.trim()) {
            setConversationError("Lead phone is required.");
            return;
        }

        if (!/^[0-9+\-\s()]+$/.test(leadPhone)) {
            setConversationError("Invalid phone number format.");
            return;
        }

        setConversationError("");

        const res = await api.post(
            `/campaigns/${campaign!.id}/conversations`,
            { leadPhone }
        );

        setConversation(res.data);
        setLeadPhone("");
    };

    // ---------------- LOAD MESSAGES ----------------
    const loadMessages = async () => {
        if (!conversation) return;

        const res = await api.get(
            `/campaigns/${conversation.id}/messages`
        );

        setMessages(res.data);
    };

    // ---------------- SEND MESSAGE ----------------
    const sendMessage = async () => {
        if (!content.trim()) {
            setMessageError("Message content cannot be empty.");
            return;
        }

        setMessageError("");

        await api.post(
            `/campaigns/${conversation!.id}/messages`,
            { content, direction }
        );

        setContent("");
        await loadMessages();
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Campaign Builder</h2>

                {/* Campaign */}
                <section style={styles.section}>
                    <h3>Create Campaign</h3>

                    <input
                        style={styles.input}
                        value={campaignName}
                        onChange={e => setCampaignName(e.target.value)}
                        placeholder="Campaign Name"
                    />

                    {campaignError && (
                        <div style={styles.error}>{campaignError}</div>
                    )}

                    <button
                        style={styles.button}
                        onClick={createCampaign}
                        disabled={!campaignName.trim()}
                    >
                        Create Campaign
                    </button>

                    {campaign && (
                        <div style={styles.success}>
                            Created: {campaign.name}
                        </div>
                    )}
                </section>

                {/* Conversation */}
                {campaign && (
                    <section style={styles.section}>
                        <h3>Create Conversation</h3>

                        <input
                            style={styles.input}
                            value={leadPhone}
                            onChange={e => setLeadPhone(e.target.value)}
                            placeholder="Lead Phone"
                        />

                        {conversationError && (
                            <div style={styles.error}>{conversationError}</div>
                        )}

                        <button
                            style={styles.button}
                            onClick={createConversation}
                            disabled={!leadPhone.trim()}
                        >
                            Add Conversation
                        </button>

                        {conversation && (
                            <div style={styles.success}>
                                Conversation with {conversation.leadPhone}
                            </div>
                        )}
                    </section>
                )}

                {/* Messages */}
                {conversation && (
                    <section style={styles.section}>
                        <h3>Messages</h3>

                        <div style={styles.chatContainer}>
                            {messages.map(m => (
                                <div
                                    key={m.id}
                                    style={{
                                        ...styles.message,
                                        ...(m.direction === 1
                                            ? styles.outbound
                                            : styles.inbound)
                                    }}
                                >
                                    {m.content}
                                </div>
                            ))}
                        </div>

                        <div style={styles.messageInputRow}>
                            <select
                                style={styles.select}
                                value={direction}
                                onChange={e =>
                                    setDirection(Number(e.target.value))
                                }
                            >
                                <option value={1}>Outbound</option>
                                <option value={2}>Inbound</option>
                            </select>

                            <input
                                style={styles.input}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Type message..."
                            />

                            <button
                                style={styles.button}
                                onClick={sendMessage}
                                disabled={!content.trim()}
                            >
                                Send
                            </button>
                        </div>

                        {messageError && (
                            <div style={styles.error}>{messageError}</div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    page: {
        background: "#f4f6f9",
        minHeight: "100vh",
        padding: "40px",
        display: "flex",
        justifyContent: "center"
    },
    card: {
        background: "white",
        padding: "30px",
        borderRadius: "12px",
        width: "700px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    },
    title: {
        marginBottom: "25px"
    },
    section: {
        marginBottom: "30px"
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },
    select: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },
    button: {
        padding: "10px 15px",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "#2563eb",
        color: "white",
        cursor: "pointer"
    },
    error: {
        color: "red",
        fontSize: "0.9rem",
        marginBottom: "10px"
    },
    success: {
        marginTop: "10px",
        color: "green"
    },
    chatContainer: {
        border: "1px solid #eee",
        borderRadius: "8px",
        padding: "15px",
        minHeight: "120px",
        marginBottom: "15px",
        background: "#fafafa"
    },
    message: {
        padding: "8px 12px",
        borderRadius: "18px",
        marginBottom: "8px",
        maxWidth: "70%"
    },
    outbound: {
        background: "#2563eb",
        color: "white",
        marginLeft: "auto"
    },
    inbound: {
        background: "#e5e7eb",
        color: "#333",
        marginRight: "auto"
    },
    messageInputRow: {
        display: "flex",
        gap: "10px",
        alignItems: "center"
    }
};
