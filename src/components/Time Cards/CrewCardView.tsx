import { useState, useEffect } from "react";
import type { HistoryData, HistoryEntry } from "./TimecardApp";

type Props = {
  selectedDate: string;
  setHistoryData: React.Dispatch<React.SetStateAction<HistoryData>>;
  historyData: HistoryData;
  crewSeconds: number;
  setCrewSeconds: React.Dispatch<React.SetStateAction<number>>;
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const CrewCardView = ({
  selectedDate,
  setHistoryData,
  crewSeconds,
  setCrewSeconds,
}: Props) => {
  const [isCrewTimerRunning, setIsCrewTimerRunning] = useState(false);
  const [crewFormSubmitted, setCrewFormSubmitted] = useState(false);
  const [employee, setEmployee] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [crewCostCode, setCrewCostCode] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let interval: number | undefined;
    if (isCrewTimerRunning) {
      interval = window.setInterval(() => {
        setCrewSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCrewTimerRunning, setCrewSeconds]);

  useEffect(() => {
    setCrewFormSubmitted(false);
    setIsCrewTimerRunning(false);
    setCrewSeconds(0);
    setEmployee("");
    setSupervisor("");
    setProjectLocation("");
    setCrewCostCode("");
    setNotes("");
  }, [selectedDate, setCrewSeconds]);

  const handleCrewClockIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newEntry: HistoryEntry = {
      time: timeString,
      action: "Crew Clocked In",
      type: "crewcard",
      data: { employee, supervisor, projectLocation, crewCostCode, notes },
    };
    setHistoryData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setIsCrewTimerRunning(true);
  };

  const handleCrewClockOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newEntry: HistoryEntry = {
      time: timeString,
      action: "Crew Clocked Out",
      type: "crewcard",
      data: { totalHours: formatTime(crewSeconds) },
    };
    setHistoryData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setIsCrewTimerRunning(false);
  };

  return (
    <>
      {!crewFormSubmitted && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Add Crew Time Card
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Employees <span className="text-red-500">*</span>
              </label>
              <input
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Enter employee name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Supervisor <span className="text-red-500">*</span>
              </label>
              <input
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Enter supervisor name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Project/Location <span className="text-red-500">*</span>
              </label>
              <input
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Enter project location"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Cost Code <span className="text-red-500">*</span>
              </label>
              <select
                value={crewCostCode}
                onChange={(e) => setCrewCostCode(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm"
              >
                <option value="">Select Cost Code</option>
                <option value="CC-001">CC-001</option>
                <option value="CC-002">CC-002</option>
                <option value="CC-003">CC-003</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Add description..."
              rows={3}
            />
          </div>
          <div className="mt-6 text-right">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
              onClick={() => {
                if (employee && supervisor && projectLocation && crewCostCode) {
                  setCrewFormSubmitted(true);
                  handleCrewClockIn();
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

      {crewFormSubmitted && (
        <div className="flex items-center justify-center mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-black flex items-center justify-center">
                    <div
                      className={`absolute top-2 left-1/2 w-0.5 h-8 bg-black origin-bottom rounded-full ${
                        isCrewTimerRunning ? "animate-rotate-clock-hand" : ""
                      }`}
                      style={{
                        transform: isCrewTimerRunning
                          ? "translateX(-50%)"
                          : "rotate(0deg) translateX(-50%)", // Stop at 12 when clocked out
                        transition: "transform 0.3s ease-out",
                      }}
                    ></div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-2 py-1 rounded text-sm">
                      {formatTime(crewSeconds)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCrewClockIn}
                  disabled={isCrewTimerRunning}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Clock In
                </button>
                <button
                  onClick={handleCrewClockOut}
                  disabled={!isCrewTimerRunning}
                  className="bg-[#e94f37] hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Clock Out
                </button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-sm w-72 space-y-2 shadow-inner">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Project</span>
                <span className="text-gray-800">{projectLocation || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Cost Code</span>
                <span className="text-gray-800">{crewCostCode || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Supervisor</span>
                <span className="text-gray-800">{supervisor || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Employees</span>
                <span className="text-gray-800">{employee || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Notes</span>
                <span className="text-gray-800">{notes || "-"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CrewCardView;
