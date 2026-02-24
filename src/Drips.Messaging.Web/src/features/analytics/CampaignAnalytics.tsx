import { useEffect, useState } from "react";
import { api } from "../../api/client";

interface Campaign {
    id: string;
    name: string;
}

interface Analytics {
    id: string;
    totalInbound: number;
    interested: number;
    confused: number;
    optOut: number;
    engagementScore: number;
    optOutRate: number;
}

export default function AnalyticsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load campaigns once
    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                const res = await api.get("/campaigns");
                setCampaigns(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load campaigns.");
            }
        };

        loadCampaigns();
    }, []);

    // Load analytics when campaign changes
    useEffect(() => {
        if (!selectedCampaignId) return;

        const loadAnalytics = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await api.get(
                    `/campaigns/${selectedCampaignId}/analytics`
                );
                setAnalytics(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load analytics.");
                setAnalytics(null);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, [selectedCampaignId]);

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Campaign Analytics</h2>

                {/* Campaign Dropdown */}
                <div style={{ marginBottom: "20px" }}>
                    <select
                        style={styles.select}
                        value={selectedCampaignId}
                        onChange={e => setSelectedCampaignId(e.target.value)}
                    >
                        <option value="">Select Campaign</option>
                        {campaigns.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* States */}
                {loading && <p>Loading analytics…</p>}
                {error && <p style={styles.error}>{error}</p>}

                {/* Analytics Panel */}
                {analytics && !loading && (
                    <div style={styles.statsGrid}>
                        <Stat label="Total Inbound" value={analytics.totalInbound} />
                        <Stat label="Interested" value={analytics.interested} />
                        <Stat label="Confused" value={analytics.confused} />
                        <Stat label="Opt-Out" value={analytics.optOut} />
                        <Stat
                            label="Engagement Score"
                            value={analytics.engagementScore.toFixed(2)}
                        />
                        <Stat
                            label="Opt-Out Rate"
                            value={`${(analytics.optOutRate * 100).toFixed(1)}%`}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: number | string }) {
    return (
        <div style={styles.statCard}>
            <div style={styles.statValue}>{value}</div>
            <div style={styles.statLabel}>{label}</div>
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
        width: "800px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
    },
    title: {
        marginBottom: "25px"
    },
    select: {
        width: "100%",
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ccc"
    },
    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginTop: "20px"
    },
    statCard: {
        background: "#f9fafb",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
    },
    statValue: {
        fontSize: "1.8rem",
        fontWeight: 700,
        marginBottom: "5px"
    },
    statLabel: {
        fontSize: "0.9rem",
        color: "#666"
    },
    error: {
        color: "red",
        marginTop: "10px"
    }
};
 