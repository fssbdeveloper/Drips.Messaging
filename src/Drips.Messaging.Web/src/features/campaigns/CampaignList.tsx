import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { Message } from "../../entities/Message";
import type { Conversation } from "../../entities/Conversation";
import type { Campaign } from "../../entities/Campaign";




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
        <div className="container py-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="mb-4">Campaigns</h2>

                    <ul className="list-group">
                        {campaigns.map(c => (
                            <li key={c.id} className="list-group-item border-0 px-0">

                                {/* CAMPAIGN ROW WITH CHEVRON */}
                                <div
                                    className="p-3 bg-light rounded fw-semibold mb-2 d-flex justify-content-between align-items-center"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => loadConversations(c.id)}
                                >
                                    {c.name}

                                    <i
                                        className={`bi ${selectedCampaignId === c.id
                                                ? "bi-chevron-down"
                                                : "bi-chevron-right"
                                            }`}
                                    ></i>
                                </div>

                                {/* CONVERSATIONS */}
                                {selectedCampaignId === c.id && (
                                    <ul className="list-group ms-3">
                                        {conversations.length === 0 && (
                                            <li className="text-muted fst-italic">No conversations yet.</li>
                                        )}

                                        {conversations.map(conv => (
                                            <li key={conv.id} className="list-group-item border-0 px-0">

                                                {/* CONVERSATION ROW WITH CHEVRON */}
                                                <div
                                                    className="d-flex justify-content-between align-items-center p-2 bg-white border rounded"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => loadMessages(conv.id)}
                                                >
                                                    <span>📞 {conv.leadPhone}</span>

                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="text-muted small">
                                                            {new Date(conv.startedAt).toLocaleString()}
                                                        </span>

                                                        <i
                                                            className={`bi ${selectedConversationId === conv.id
                                                                    ? "bi-chevron-down"
                                                                    : "bi-chevron-right"
                                                                }`}
                                                        ></i>
                                                    </div>
                                                </div>

                                                {/* MESSAGES */}
                                                {selectedConversationId === conv.id && (
                                                    <div className="border rounded p-3 mt-2 bg-light">
                                                        {messages.length === 0 && (
                                                            <div className="text-muted fst-italic">
                                                                No messages yet.
                                                            </div>
                                                        )}

                                                        {messages.map(msg => (
                                                            <div
                                                                key={msg.id}
                                                                className={`p-2 rounded mb-2 w-5 ${msg.direction === "Outbound"
                                                                        ? "bg-primary text-white ms-auto"
                                                                        : "bg-secondary text-white me-auto"
                                                                    }`}
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
        </div>
    );
}