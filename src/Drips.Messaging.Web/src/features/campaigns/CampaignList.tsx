import { useEffect, useState } from "react";
import { api } from "../../api/client";

interface Campaign {
    id: string;
    name: string;
}

interface Conversation {
    id: string;
    leadPhone: string;
    startedAt: string;
}

interface Message {
    id: string;
    content: string;
    direction: number;
    sentAtUtc: string;
}

export default function CampaignList() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        api.get("/campaigns")
            .then(res => setCampaigns(res.data))
            .catch(err => console.error(err));
    }, []);

    const loadConversations = async (campaignId: string) => {
        if (selectedCampaignId === campaignId) {
            setSelectedCampaignId(null);
            setConversations([]);
            setSelectedConversationId(null);
            setMessages([]);
            return;
        }

        try {
            const res = await api.get(`/campaigns/${campaignId}/conversations`);
            setSelectedCampaignId(campaignId);
            setConversations(res.data);
            setSelectedConversationId(null);
            setMessages([]);
        } catch (err) {
            console.error(err);
        }
    };

    const loadMessages = async (conversationId: string) => {
        if (selectedConversationId === conversationId) {
            setSelectedConversationId(null);
            setMessages([]);
            return;
        }

        try {
            const res = await api.get(`/campaigns/${conversationId}/messages`);
            setSelectedConversationId(conversationId);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Campaigns</h2>

                <ul style={styles.list}>
                    {campaigns.map(c => (
                        <li key={c.id} style={styles.listItem}>
                            <div
                                style={styles.campaignRow}
                                onClick={() => loadConversations(c.id)}
                            >
                                {c.name}
                            </div>

                            {selectedCampaignId === c.id && (
                                <ul style={styles.subList}>
                                    {conversations.length === 0 && (
                                        <li style={styles.empty}>No conversations yet.</li>
                                    )}

                                    {conversations.map(conv => (
                                        <li key={conv.id} style={styles.listItem}>
                                            <div
                                                style={styles.conversationRow}
                                                onClick={() => loadMessages(conv.id)}
                                            >
                                                📞 {conv.leadPhone}
                                                <span style={styles.timestamp}>
                                                    {new Date(conv.startedAt).toLocaleString()}
                                                </span>
                                            </div>

                                            {selectedConversationId === conv.id && (
                                                <div style={styles.chatContainer}>
                                                    {messages.length === 0 && (
                                                        <div style={styles.empty}>No messages yet.</div>
                                                    )}

                                                    {messages.map(msg => (
                                                        <div
                                                            key={msg.id}
                                                            style={{
                                                                ...styles.message,
                                                                ...(msg.direction === 1
                                                                    ? styles.outbound
                                                                    : styles.inbound)
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
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
    list: {
        listStyle: "none",
        padding: 0
    },
    listItem: {
        marginBottom: "15px"
    },
    campaignRow: {
        cursor: "pointer",
        fontWeight: "bold",
        padding: "10px",
        borderRadius: "8px",
        background: "#eef2ff",
        border: "1px solid #c7d2fe"
    },
    subList: {
        listStyle: "none",
        paddingLeft: "20px",
        marginTop: "10px"
    },
    conversationRow: {
        cursor: "pointer",
        padding: "8px 10px",
        borderRadius: "6px",
        background: "#f3f4f6",
        border: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    timestamp: {
        fontSize: "0.8rem",
        color: "#666"
    },
    empty: {
        color: "#777",
        fontStyle: "italic",
        padding: "5px 0"
    },
    chatContainer: {
        border: "1px solid #eee",
        borderRadius: "8px",
        padding: "15px",
        marginTop: "10px",
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
    }
};
 