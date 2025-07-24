import { useState, useEffect } from "react";
import type { HistoryData, HistoryEntry } from "./TimecardApp";

type Props = {
  selectedDate: string;
  setHistoryData: React.Dispatch<React.SetStateAction<HistoryData>>;
  historyData: HistoryData;
  timecardSeconds: number;
  setTimecardSeconds: React.Dispatch<React.SetStateAction<number>>;
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const TimecardView = ({
  selectedDate,
  setHistoryData,
  timecardSeconds,
  setTimecardSeconds,
}: Props) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [clockInTime, setClockInTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });
  const [project, setProject] = useState("");
  const [serviceTicket, setServiceTicket] = useState("");
  const [costCode, setCostCode] = useState("");

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimecardSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, setTimecardSeconds]);

  // Reset on date change
  useEffect(() => {
    setIsFormSubmitted(false);
    setIsTimerRunning(false);
    setTimecardSeconds(0);
    setProject("");
    setServiceTicket("");
    setCostCode("");
    setClockInTime(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }, [selectedDate, setTimecardSeconds]);

  const handleClockIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newEntry: HistoryEntry = {
      time: timeString,
      action: "Clocked In",
      type: "timecard",
      data: { project, serviceTicket, costCode },
    };
    setHistoryData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setIsTimerRunning(true);
  };

  const handleClockOut = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newEntry: HistoryEntry = {
      time: timeString,
      action: "Clocked Out",
      type: "timecard",
      data: { totalHours: formatTime(timecardSeconds) },
    };
    setHistoryData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setIsTimerRunning(false);
  };

  return (
    <>
      {!isFormSubmitted && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 max-w-4xl mx-auto space-y-4">
          <div className="grid grid-cols-5 gap-4 items-center">
            <label className="text-sm font-medium col-span-1">
              Clock-In Time
            </label>
            <div className="col-span-4 flex items-center">
              <input
                type="text"
                value={clockInTime}
                onChange={(e) => setClockInTime(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-full"
              />
            </div>
            <label className="text-sm font-medium col-span-1">
              Project/Location <span className="text-red-500">*</span>
            </label>
            <div className="col-span-4">
              <input
                type="text"
                placeholder="+ Select Project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-full"
              />
            </div>
            <label className="text-sm font-medium col-span-1">
              Service Ticket
            </label>
            <div className="col-span-4">
              <select
                value={serviceTicket}
                onChange={(e) => setServiceTicket(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-full"
              >
                <option>Unassigned</option>
                <option>ST-001</option>
                <option>ST-002</option>
              </select>
            </div>
            <label className="text-sm font-medium col-span-1">
              Cost Code <span className="text-red-500">*</span>
            </label>
            <div className="col-span-4">
              <select
                value={costCode}
                onChange={(e) => setCostCode(e.target.value)}
                className="border rounded px-3 py-2 text-sm w-full"
              >
                <option value="">Unassigned</option>
                <option value="CC-001">CC-001</option>
                <option value="CC-002">CC-002</option>
              </select>
            </div>
            <div className="col-span-5 flex justify-end">
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm"
                onClick={() => {
                  if (project && costCode) {
                    setIsFormSubmitted(true);
                    handleClockIn();
                  } else {
                    alert(
                      "Please fill required fields: Project/Location and Cost Code"
                    );
                  }
                }}
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormSubmitted && (
        <div className="flex items-center justify-center mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  {/* Clock circle */}
                  <div className="w-24 h-24 rounded-full border-4 border-[#2d4974] flex items-center justify-center relative">
                    {/* Rotating arrow */}
                    <div
                      className={`absolute top-2 left-1/2 w-0.5 h-8 bg-[#2d4974] origin-bottom rounded-full ${
                        isTimerRunning ? "animate-rotate-clock-hand" : ""
                      }`}
                      style={{
                        transform: isTimerRunning
                          ? "translateX(-50%)"
                          : "rotate(0deg) translateX(-50%)", // Stop at 12 when clocked out
                        transition: "transform 0.3s ease-out",
                      }}
                    ></div>
                  </div>

                  {/* Time display */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-2 py-1 rounded text-sm">
                      {formatTime(timecardSeconds)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleClockIn}
                  disabled={isTimerRunning}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clock In
                </button>
                <button
                  onClick={handleClockOut}
                  disabled={!isTimerRunning}
                  className="bg-[#e94f37] hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clock Out
                </button>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 text-sm w-72 space-y-2 shadow-inner">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Project</span>
                <span className="text-gray-800">{project || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">
                  Service Ticket
                </span>
                <span className="text-gray-800">{serviceTicket || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Cost Code</span>
                <span className="text-gray-800">{costCode || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Any Injury</span>
                <span className="text-gray-800">-</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TimecardView;
