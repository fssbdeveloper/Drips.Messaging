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
    // Campaign
    const [campaignName, setCampaignName] = useState("");
    const [campaign, setCampaign] = useState<Campaign | null>(null);

    // Conversation
    const [leadPhone, setLeadPhone] = useState("");
    const [conversation, setConversation] = useState<Conversation | null>(null);

    // Message
    const [content, setContent] = useState("");
    const [direction, setDirection] = useState<number>(1);
    const [messages, setMessages] = useState<Message[]>([]);

    // --------------------------
    // CREATE CAMPAIGN
    // --------------------------
    const createCampaign = async () => {
        if (!campaignName.trim()) return;

        const res = await api.post("/campaigns", {
            name: campaignName
        });

        setCampaign(res.data);
        setCampaignName("");
    };

    // --------------------------
    // CREATE CONVERSATION
    // --------------------------
    const createConversation = async () => {
        if (!campaign) return;
        if (!leadPhone.trim()) return;

        const res = await api.post(
            `/campaigns/${campaign.id}/conversations`,
            { leadPhone }
        );

        setConversation(res.data);
        setLeadPhone("");
    };

    // --------------------------
    // LOAD MESSAGES
    // --------------------------
    const loadMessages = async () => {
        if (!conversation) return;

        const res = await api.get(
            `/campaigns/${conversation.id}/messages`
        );

        setMessages(res.data);
    };

    // --------------------------
    // SEND MESSAGE
    // --------------------------
    const sendMessage = async () => {
        if (!conversation) return;
        if (!content.trim()) return;

        await api.post(
            `/campaigns/${conversation.id}/messages`,
            {
                content,
                direction
            }
        );

        setContent("");
        await loadMessages();
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px" }}>
            <h2>Campaign Builder</h2>

            {/* ---------------- Campaign ---------------- */}
            <div style={{ marginBottom: "20px" }}>
                <h3>Create Campaign</h3>
                <input
                    value={campaignName}
                    onChange={e => setCampaignName(e.target.value)}
                    placeholder="Campaign Name"
                />
                <button onClick={createCampaign}>
                    Create
                </button>

                {campaign && (
                    <div style={{ marginTop: "10px" }}>
                        ✅ Created: <strong>{campaign.name}</strong>
                    </div>
                )}
            </div>

            {/* ---------------- Conversation ---------------- */}
            {campaign && (
                <div style={{ marginBottom: "20px" }}>
                    <h3>Create Conversation</h3>
                    <input
                        value={leadPhone}
                        onChange={e => setLeadPhone(e.target.value)}
                        placeholder="Lead Phone"
                    />
                    <button onClick={createConversation}>
                        Add Conversation
                    </button>

                    {conversation && (
                        <div style={{ marginTop: "10px" }}>
                            📞 Conversation with {conversation.leadPhone}
                        </div>
                    )}
                </div>
            )}

            {/* ---------------- Messages ---------------- */}
            {conversation && (
                <div>
                    <h3>Messages</h3>

                    <button onClick={loadMessages}>
                        Refresh Messages
                    </button>

                    <ul style={{ marginTop: "10px" }}>
                        {messages.map(m => (
                            <li key={m.id}>
                                <strong>
                                    {m.direction === 1
                                        ? "Outbound"
                                        : "Inbound"}
                                </strong>
                                : {m.content}
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: "15px" }}>
                        <select
                            value={direction}
                            onChange={e => setDirection(Number(e.target.value))}
                        >
                            <option value={1}>Outbound</option>
                            <option value={2}>Inbound</option>
                        </select>

                        <input
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder="Message content"
                        />

                        <button onClick={sendMessage}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
