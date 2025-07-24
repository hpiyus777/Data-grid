import { useState } from "react";
import { Calendar as LucideCalendar } from "lucide-react";
import Sidebar from "./Sidebar";
import TimecardView from "./TimecardView";
import CrewCardView from "./CrewCardView";
import CrewSheetView from "./CrewSheetView";
import TimelineHistory from "./TimelineHistory";

export type HistoryEntry = {
  time: string;
  action: string;
  type: "timecard" | "crewcard" | "crewsheet";
  data?: any;
};
export type HistoryData = { [date: string]: HistoryEntry[] };

const initialHistory: HistoryData = {
  "2025-07-23": [
    { time: "11:50 AM", action: "Clocked In", type: "timecard" },
    { time: "11:51 AM", action: "Clocked Out", type: "timecard" },
  ],
  "2025-07-22": [
    { time: "09:30 AM", action: "Clocked In", type: "timecard" },
    { time: "05:00 PM", action: "Clocked Out", type: "timecard" },
  ],
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const formatDateForDisplay = (dateStr: string) => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const TimecardApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [activeView, setActiveView] = useState<
    "timecard" | "crewcard" | "crewsheet"
  >("timecard");
  const [historyData, setHistoryData] = useState<HistoryData>(initialHistory);

  // Timer states for each view
  const [timecardSeconds, setTimecardSeconds] = useState(0);
  const [crewSeconds, setCrewSeconds] = useState(0);
  const [sheetSeconds, setSheetSeconds] = useState(0);

  // Reset all timer states (called on date change)
  const resetAllStates = () => {
    setTimecardSeconds(0);
    setCrewSeconds(0);
    setSheetSeconds(0);
  };

  const currentHistory = historyData[selectedDate] || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        formatDateForDisplay={formatDateForDisplay}
        currentHistory={currentHistory}
        resetAllStates={resetAllStates}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded hover:bg-gray-100"
              >
                <LucideCalendar className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-800">
              Time Card: {formatDateForDisplay(selectedDate)}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-lg font-mono">
              Total Hours:{" "}
              {activeView === "timecard"
                ? formatTime(timecardSeconds)
                : activeView === "crewcard"
                ? formatTime(crewSeconds)
                : formatTime(sheetSeconds)}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView("timecard")}
                className={`flex items-center text-sm px-3 py-2 rounded transition-colors ${
                  activeView === "timecard"
                    ? "bg-[#e94f37] text-white"
                    : "bg-[#1a355e] text-white hover:bg-gray-400"
                }`}
              >
                <span className="mr-1">+</span> Time Card
              </button>
              <button
                onClick={() => setActiveView("crewcard")}
                className={`flex items-center text-sm px-3 py-2 rounded transition-colors ${
                  activeView === "crewcard"
                    ? "bg-[#e94f37] text-white"
                    : "bg-[#1a355e] text-white hover:bg-gray-400"
                }`}
              >
                <span className="mr-1">+</span> Crew Card
              </button>
              <button
                onClick={() => setActiveView("crewsheet")}
                className={`flex items-center text-sm px-3 py-2 rounded transition-colors ${
                  activeView === "crewsheet"
                    ? "bg-[#e94f37] text-white"
                    : "bg-[#1a355e] text-white hover:bg-gray-400"
                }`}
              >
                <span className="mr-1">+</span> Crew Sheet
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {activeView === "timecard" && (
              <TimecardView
                selectedDate={selectedDate}
                setHistoryData={setHistoryData}
                historyData={historyData}
                timecardSeconds={timecardSeconds}
                setTimecardSeconds={setTimecardSeconds}
              />
            )}
            {activeView === "crewcard" && (
              <CrewCardView
                selectedDate={selectedDate}
                setHistoryData={setHistoryData}
                historyData={historyData}
                crewSeconds={crewSeconds}
                setCrewSeconds={setCrewSeconds}
              />
            )}
            {activeView === "crewsheet" && (
              <CrewSheetView
                selectedDate={selectedDate}
                setHistoryData={setHistoryData}
                historyData={historyData}
                sheetSeconds={sheetSeconds}
                setSheetSeconds={setSheetSeconds}
              />
            )}

            {/* Timeline History */}
            <TimelineHistory
              currentHistory={currentHistory}
              formatDateForDisplay={formatDateForDisplay}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimecardApp;
