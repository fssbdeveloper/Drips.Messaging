import { Routes, Route, Link } from "react-router-dom";
import CampaignList from "./features/campaigns/CampaignList";
import CreateCampaign from "./features/campaigns/CreateCampaign";
import ConversationView from "./features/conversations/ConversationView";

export default function App() {
    return (
        <div style={{ padding: 20 }}>
            <h1>Drips</h1>

            <nav style={styles.nav}>
                <Link to="/" style={styles.navLink}>Campaigns</Link>
                <span style={styles.divider}>|</span>
                <Link to="/create" style={styles.navLink}>Create Campaign</Link>
            </nav>


            <Routes>
                <Route path="/" element={<CampaignList />} />
                <Route path="/create" element={<CreateCampaign />} />
                <Route path="/campaign/:id" element={<ConversationView />} />
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


//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'

//function App() {
//  const [count, setCount] = useState(0)

//  return (
//    <>
//      <div>
//        <a href="https://vite.dev" target="_blank">
//          <img src={viteLogo} className="logo" alt="Vite logo" />
//        </a>
//        <a href="https://react.dev" target="_blank">
//          <img src={reactLogo} className="logo react" alt="React logo" />
//        </a>
//      </div>
//      <h1>Vite + React</h1>
//      <div className="card">
//        <button onClick={() => setCount((count) => count + 1)}>
//          count is {count}
//        </button>
//        <p>
//          Edit <code>src/App.tsx</code> and save to test HMR
//        </p>
//      </div>
//      <p className="read-the-docs">
//        Click on the Vite and React logos to learn more
//      </p>
//    </>
//  )
//}

//export default App
