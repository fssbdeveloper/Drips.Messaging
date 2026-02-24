import { useState } from "react";
import { api } from "../../api/client";
import { useNavigate } from "react-router-dom";

export default function CreateCampaign() {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const submit = async () => {
        const response = await api.post("/campaigns", {
            name: name,
            companyId: 1
        });

        navigate(`/campaign/${response.data.id}`);
    };

    return (
        <div>
            <h2>Create Campaign</h2>
            <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Campaign Name"
            />
            <button onClick={submit}>Create</button>
        </div>
    );
}
