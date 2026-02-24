import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/client";

interface Message {
    id: number;
    content: string;
    direction: number;
    signal:string
}

export default function ConversationView() {
    const { id } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [content, setContent] = useState("");

    useEffect(() => {
        api.get(`/conversations/by-campaign/${id}`)
            .then(res => setMessages(res.data.messages))
            .catch(err => console.error(err));
    }, [id]);

    const send = async () => {
        await api.post("/messages", {
            conversationId: id,
            content: content,
            direction: 1
        });

        setContent("");
    };

    return (
        <div>
            <h2>Conversation</h2>

            {messages.map(m => (
                <div key={m.id}>
                    <strong>{m.direction === 1 ? "Outbound" : "Inbound"}:</strong>
                    {m.content}
                </div>
            ))}

            <input
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Type message"
            />
            <button onClick={send}>Send</button>
        </div>
    );
}
