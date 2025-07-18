import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "./components/Sidebar/mainsidebar";
import DataGrid from "./components/dataGrid";
import Dashboard from "./components/Dashboard/dashboard";
import Header from "./components/Header/header";
import TermConditions from "./components/Sidebar/TermConditions";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPageTitle, setSelectedPageTitle] = useState("My Dashboard");

  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <div className="h-screen overflow-auto">
          {/* Header with dynamic title */}
          <Header
            onSidebarToggle={() => setIsSidebarOpen(true)}
            title={selectedPageTitle}
          />

          {/* Sidebar */}
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onSelect={(title: string) => {
              setSelectedPageTitle(title);
              setIsSidebarOpen(false);
            }}
          />

          {/* Routes */}
          <div className="p-4">
            <Routes>
              <Route path="/" element={<DataGrid />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/term-conditions" element={<TermConditions />} />
            </Routes>
          </div>
        </div>
      </DndProvider>
    </Router>
  );
};

export default App;
