import { Routes, Route, Link } from "react-router-dom";
import CampaignList from "./features/campaigns/CampaignList";
import CreateCampaign from "./features/campaigns/CreateCampaign";
import ConversationView from "./features/conversations/ConversationView";

export default function App() {
    return (
        <div style={{ padding: 20 }}>
            <h1>Drips</h1>

            <nav>
                <Link to="/">Campaigns</Link> |{" "}
                <Link to="/create">Create Campaign</Link>
            </nav>

            <Routes>
                <Route path="/" element={<CampaignList />} />
                <Route path="/create" element={<CreateCampaign />} />
                <Route path="/campaign/:id" element={<ConversationView />} />
            </Routes>
        </div>
    );
}




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
