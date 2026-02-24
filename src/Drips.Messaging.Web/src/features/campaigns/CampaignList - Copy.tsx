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

export default function CampaignList() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        api.get("/campaigns")
            .then(res => setCampaigns(res.data))
            .catch(err => console.error(err));
    }, []);

    const loadConversations = async (campaignId: string) => {
        if (selectedCampaignId === campaignId) {
            // collapse if clicking again
            setSelectedCampaignId(null);
            setConversations([]);
            return;
        }

        try {
            const res = await api.get(`/campaigns/${campaignId}/conversations`);
            setSelectedCampaignId(campaignId);
            setConversations(res.data);
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
                                    <li key={conv.id}>
                                        {conv.leadPhone} – {new Date(conv.startedAt).toLocaleString()}
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
