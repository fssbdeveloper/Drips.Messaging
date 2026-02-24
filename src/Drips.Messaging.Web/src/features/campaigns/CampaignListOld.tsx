import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { Link } from "react-router-dom";

interface Campaign {
    id: number;
    name: string;
}

export default function CampaignList() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        api.get("/campaigns")
            .then(res => setCampaigns(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Campaigns</h2>
            <ul>
                {campaigns.map(c => (
                    <li key={c.id}>
                        <Link to={`/campaign/${c.id}`}>
                            {c.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
