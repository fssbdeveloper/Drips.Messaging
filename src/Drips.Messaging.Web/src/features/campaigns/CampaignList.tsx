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
        <div>
            <h2>Campaigns</h2>

            <ul>
                {campaigns.map(c => (
                    <li key={c.id} style={{ marginBottom: "10px" }}>
                        <div
                            style={{ cursor: "pointer", fontWeight: "bold" }}
                            onClick={() => loadConversations(c.id)}
                        >
                            {c.name}
                        </div>

                        {selectedCampaignId === c.id && (
                            <ul style={{ marginTop: "5px", marginLeft: "15px" }}>
                                {conversations.length === 0 && (
                                    <li>No conversations yet.</li>
                                )}

                                {conversations.map(conv => (
                                    <li key={conv.id} style={{ marginBottom: "8px" }}>
                                        <div
                                            style={{ cursor: "pointer" }}
                                            onClick={() => loadMessages(conv.id)}
                                        >
                                            📞 {conv.leadPhone} –{" "}
                                            {new Date(conv.startedAt).toLocaleString()}
                                        </div>

                                        {selectedConversationId === conv.id && (
                                            <ul style={{ marginLeft: "15px", marginTop: "5px" }}>
                                                {messages.length === 0 && (
                                                    <li>No messages yet.</li>
                                                )}

                                                {messages.map(msg => (
                                                    <li key={msg.id}>
                                                        <strong>
                                                            {msg.direction === 1
                                                                ? "Outbound"
                                                                : "Inbound"}
                                                        </strong>
                                                        : {msg.content}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
