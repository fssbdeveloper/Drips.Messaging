import { Routes, Route, Link } from "react-router-dom";
import CampaignList from "./features/campaigns/CampaignList";
import CreateCampaign from "./features/campaigns/CreateCampaign";
import CampaignAnalytics from "./features/analytics/CampaignAnalytics";
export default function App() {
    return (
        <div style={{ padding: 20 }}>
            <h1>Drips</h1>
            <h5>Initiate and track SMS conversations - v1</h5> 
            <nav style={styles.nav}>
                <Link to="/" style={styles.navLink}>Campaigns</Link>
                <span style={styles.divider}>|</span>
                <Link to="/create" style={styles.navLink}>Create Campaign</Link>
                <Link to="/analytics" style={styles.navLink}>Campaign Analytics</Link>
              
            </nav>
                   


            <Routes>
                <Route path="/" element={<CampaignList />} />
                <Route path="/create" element={<CreateCampaign />} />             
                <Route path="/analytics" element={<CampaignAnalytics />} />
                
            </Routes>
        </div>
    );
}


const styles: { [key: string]: React.CSSProperties } = {
    nav: {
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginBottom: "20px"
    },
    navLink: {
        textDecoration: "none",
        color: "#2563eb",
        fontWeight: 500,
        padding: "6px 10px",
        borderRadius: "6px",
        transition: "0.2s ease",
    },
    divider: {
        color: "#999"
    }
};

 