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

    // VALIDATION HELPERS
    const validateCampaignName = (name: string) => {
        if (!name.trim()) return "Please enter a campaign name.";
        if (name.length < 3) return "Campaign name must be at least 3 characters.";
        return "";
    };

    const validatePhone = (phone: string) => {
        if (!phone.trim()) return "Please enter a phone number.";
        if (!/^[0-9+\-\s()]+$/.test(phone)) {
            return "Phone numbers may only contain digits, spaces, +, -, and parentheses.";
        }
        if (phone.replace(/\D/g, "").length < 10) {
            return "Phone number must contain at least 10 digits.";
        }
        return "";
    };

    const validateMessage = (msg: string) => {
        if (!msg.trim()) return "Message cannot be empty.";
        if (msg.length > 500) return "Messages cannot exceed 500 characters.";
        return "";
    };

    // CREATE CAMPAIGN
    const createCampaign = async () => {
        const error = validateCampaignName(campaignName);
        if (error) return setCampaignError(error);

        setCampaignError("");

        try {
            const res = await api.post("/campaigns", { name: campaignName });
            setCampaign(res.data);
            setCampaignName("");
        } catch {
            setCampaignError("Something went wrong while creating the campaign.");
        }
    };

    // CREATE CONVERSATION
    const createConversation = async () => {
        if (!campaign) return setConversationError("Please create a campaign first.");

        const error = validatePhone(leadPhone);
        if (error) return setConversationError(error);

        setConversationError("");

        try {
            const res = await api.post(`/campaigns/${campaign.id}/conversations`, { leadPhone });
            setConversation(res.data);
            setLeadPhone("");
        } catch {
            setConversationError("Unable to create conversation.");
        }
    };

    // LOAD MESSAGES
    const loadMessages = async () => {
        if (!conversation) return;

        try {
            const res = await api.get(`/campaigns/${conversation.id}/messages`);
            setMessages(res.data);
        } catch {
            setMessageError("Unable to load messages.");
        }
    };

    // SEND MESSAGE
    const sendMessage = async () => {
        if (!conversation) return setMessageError("Please create a conversation first.");

        const error = validateMessage(content);
        if (error) return setMessageError(error);

        setMessageError("");

        try {
            await api.post(`/campaigns/${conversation.id}/messages`, { content, direction });
            setContent("");
            await loadMessages();
        } catch {
            setMessageError("Failed to send message.");
        }
    };

    return (
        <div className="container py-4">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h3 className="mb-4">Add a new campaign</h3>

                    {/* CREATE CAMPAIGN */}
                    <section className="mb-4">
                       {/* <h4>Create Campaign</h4>*/}

                        <input
                            className="form-control mb-2"
                            value={campaignName}
                            onChange={e => setCampaignName(e.target.value)}
                            placeholder="Campaign Name"
                        />

                        {campaignError && (
                            <div className="alert alert-danger py-2">{campaignError}</div>
                        )}

                        <button className="btn btn-primary" onClick={createCampaign}>
                            Create Campaign
                        </button>

                        {campaign && (
                            <div className="alert alert-success mt-3">
                                Campaign created: <strong>{campaign.name}</strong>
                            </div>
                        )}
                    </section>

                    {/* CREATE CONVERSATION */}
                    {campaign && (
                        <section className="mb-4">
                            <h5>Enter phone number to start conversation</h5>

                            <input
                                className="form-control mb-2"
                                value={leadPhone}
                                onChange={e => setLeadPhone(e.target.value)}
                                placeholder="Phone"
                            />

                            {conversationError && (
                                <div className="alert alert-danger py-2">{conversationError}</div>
                            )}

                            <button className="btn btn-primary" onClick={createConversation}>
                                Start Conversation
                            </button>

                            {conversation && (
                                <div className="alert alert-success mt-3">
                                    Conversation started with <strong>{conversation.leadPhone}</strong>
                                </div>
                            )}
                        </section>
                    )}

                    {/* MESSAGES */}
                    {conversation && (
                        <section>
                            <h4>Messages</h4>

                            <div className="border rounded p-3 mb-3 bg-light" style={{ minHeight: "120px" }}>
                                {messages.map(m => (
                                    <div
                                        key={m.id}
                                        className={`p-2 rounded mb-2 w-75 ${m.direction === 1
                                                ? "bg-primary text-white ms-auto"
                                                : "bg-secondary text-white me-auto"
                                            }`}
                                    >
                                        {m.content}
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex gap-2 align-items-center">
                                <select
                                    className="form-select w-auto"
                                    value={direction}
                                    onChange={e => setDirection(Number(e.target.value))}
                                >
                                    <option value={1}>Outbound</option>
                                    <option value={2}>Inbound</option>
                                </select>

                                <input
                                    className="form-control"
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Type message..."
                                />

                                <button className="btn btn-primary" onClick={sendMessage}>
                                    Send
                                </button>
                            </div>

                            {messageError && (
                                <div className="alert alert-danger mt-2 py-2">{messageError}</div>
                            )}
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
 