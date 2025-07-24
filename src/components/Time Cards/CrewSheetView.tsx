import { useState, useEffect } from "react";
import type { HistoryData, HistoryEntry } from "./TimecardApp";

type Props = {
  selectedDate: string;
  setHistoryData: React.Dispatch<React.SetStateAction<HistoryData>>;
  historyData: HistoryData;
  sheetSeconds: number;
  setSheetSeconds: React.Dispatch<React.SetStateAction<number>>;
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const CrewSheetView = ({
  selectedDate,
  setHistoryData,
  sheetSeconds,
  setSheetSeconds,
}: Props) => {
  const [isSheetTimerRunning, setIsSheetTimerRunning] = useState(false);
  const [sheetFormSubmitted, setSheetFormSubmitted] = useState(false);
  const [sheetEmployee, setSheetEmployee] = useState("");
  const [sheetSupervisor, setSheetSupervisor] = useState("");
  const [sheetProject, setSheetProject] = useState("");
  const [sheetCostCode, setSheetCostCode] = useState("");
  const [sheetNotes, setSheetNotes] = useState("");

  useEffect(() => {
    let interval: number | undefined;
    if (isSheetTimerRunning) {
      interval = window.setInterval(() => {
        setSheetSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSheetTimerRunning, setSheetSeconds]);

  useEffect(() => {
    setSheetFormSubmitted(false);
    setIsSheetTimerRunning(false);
    setSheetSeconds(0);
    setSheetEmployee("");
    setSheetSupervisor("");
    setSheetProject("");
    setSheetCostCode("");
    setSheetNotes("");
  }, [selectedDate, setSheetSeconds]);

  const handleSheetClockIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newEntry: HistoryEntry = {
      time: timeString,
      action: "Sheet Clocked In",
      type: "crewsheet",
      data: {
        sheetEmployee,
        sheetSupervisor,
        sheetProject,
        sheetCostCode,
        sheetNotes,
      },
    };
    setHistoryData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setIsSheetTimerRunning(true);
  };

  const handleSheetClockOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newEntry: HistoryEntry = {
      time: timeString,
      action: "Sheet Clocked Out",
      type: "crewsheet",
      data: { totalHours: formatTime(sheetSeconds) },
    };
    setHistoryData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setIsSheetTimerRunning(false);
  };

  return (
    <>
      {!sheetFormSubmitted && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Add Crew Sheet
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={sheetEmployee}
                  onChange={(e) => setSheetEmployee(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Enter employee name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Supervisor <span className="text-red-500">*</span>
                </label>
                <input
                  value={sheetSupervisor}
                  onChange={(e) => setSheetSupervisor(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Enter supervisor name"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Project/Location <span className="text-red-500">*</span>
                </label>
                <input
                  value={sheetProject}
                  onChange={(e) => setSheetProject(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Enter project location"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Cost Code <span className="text-red-500">*</span>
                </label>
                <select
                  value={sheetCostCode}
                  onChange={(e) => setSheetCostCode(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="">Select Cost Code</option>
                  <option value="CC-001">CC-001</option>
                  <option value="CC-002">CC-002</option>
                  <option value="CC-003">CC-003</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Work Description
              </label>
              <textarea
                value={sheetNotes}
                onChange={(e) => setSheetNotes(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Enter work description..."
                rows={4}
              />
            </div>
          </div>
          <div className="mt-6 text-right">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              onClick={() => {
                if (
                  sheetEmployee &&
                  sheetSupervisor &&
                  sheetProject &&
                  sheetCostCode
                ) {
                  setSheetFormSubmitted(true);
                  handleSheetClockIn();
                } else {
                  alert("Please fill all required fields");
                }
              }}
            >
              Submit & Start Timer
            </button>
          </div>
        </div>
      )}

      {sheetFormSubmitted && (
        <div className="flex items-center justify-center mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-[#e94f37] flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#e94f37] rounded-full"></div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-2 py-1 rounded text-sm">
                      {formatTime(sheetSeconds)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleSheetClockIn}
                  disabled={isSheetTimerRunning}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Clock In
                </button>
                <button
                  onClick={handleSheetClockOut}
                  disabled={!isSheetTimerRunning}
                  className="bg-[#e94f37] hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Clock Out
                </button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-sm w-72 space-y-2 shadow-inner">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Project</span>
                <span className="text-gray-800">{sheetProject || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Cost Code</span>
                <span className="text-gray-800">{sheetCostCode || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Supervisor</span>
                <span className="text-gray-800">{sheetSupervisor || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Employee</span>
                <span className="text-gray-800">{sheetEmployee || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Work Desc</span>
                <span className="text-gray-800 truncate">
                  {sheetNotes || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CrewSheetView;
