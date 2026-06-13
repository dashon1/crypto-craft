import Layout from "./Layout.jsx";

import AITutor from "./AITutor";

import Community from "./Community";

import CustomPlan from "./CustomPlan";

import Glossary from "./Glossary";

import Home from "./Home";

import Learn from "./Learn";

import Lesson from "./Lesson";

import Library from "./Library";

import Market from "./Market";

import Portfolio from "./Portfolio";

import Practice from "./Practice";

import Social from "./Social";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    AITutor: AITutor,
    
    Community: Community,
    
    CustomPlan: CustomPlan,
    
    Glossary: Glossary,
    
    Home: Home,
    
    Learn: Learn,
    
    Lesson: Lesson,
    
    Library: Library,
    
    Market: Market,
    
    Portfolio: Portfolio,
    
    Practice: Practice,
    
    Social: Social,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<AITutor />} />
                
                
                <Route path="/AITutor" element={<AITutor />} />
                
                <Route path="/Community" element={<Community />} />
                
                <Route path="/CustomPlan" element={<CustomPlan />} />
                
                <Route path="/Glossary" element={<Glossary />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Learn" element={<Learn />} />
                
                <Route path="/Lesson" element={<Lesson />} />
                
                <Route path="/Library" element={<Library />} />
                
                <Route path="/Market" element={<Market />} />
                
                <Route path="/Portfolio" element={<Portfolio />} />
                
                <Route path="/Practice" element={<Practice />} />
                
                <Route path="/Social" element={<Social />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}