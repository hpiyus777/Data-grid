import { useEffect } from "react";
import type { HistoryEntry } from "./TimecardApp";
import type { Props } from "react-apexcharts";

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const defaultState = {
  isFormSubmitted: false,
  isTimerRunning: false,
  seconds: 0,
  project: "",
  serviceTicket: "",
  costCode: "",
  clockInTime: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
};

const TimecardView = ({
  selectedDate,
  setHistoryData,
  timecardState,
  setTimecardState,
}: Props) => {
  const state = timecardState || defaultState;

  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    if (state.isTimerRunning) {
      interval = window.setInterval(() => {
        setTimecardState({ seconds: (state.seconds || 0) + 1 });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [state.isTimerRunning, state.seconds]);

  // Reset on date change
  useEffect(() => {
    if (!timecardState) {
      setTimecardState(defaultState);
    }
    // eslint-disable-next-line
  }, [selectedDate]);

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
      data: {
        project: state.project,
        serviceTicket: state.serviceTicket,
        costCode: state.costCode,
      },
    };
    setHistoryData((prev: any) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setTimecardState({
      isFormSubmitted: true,
      isTimerRunning: true,
      clockInTime: timeString,
      seconds: 0,
    });
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
      data: { totalHours: formatTime(state.seconds) },
    };
    setHistoryData((prev: any) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setTimecardState({
      isTimerRunning: false,
      isFormSubmitted: false,
      seconds: 0,
      project: "",
      serviceTicket: "",
      costCode: "",
      clockInTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  return (
    <>
      {!state.isFormSubmitted ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 max-w-4xl mx-auto space-y-4">
          <div className="grid grid-cols-5 gap-4 items-center">
            <label className="text-sm font-medium col-span-1">
              Clock-In Time
            </label>
            <div className="col-span-4 flex items-center">
              <input
                type="text"
                value={state.clockInTime}
                onChange={(e) =>
                  setTimecardState({ clockInTime: e.target.value })
                }
                className="border rounded px-3 py-2 text-sm w-full"
              />
            </div>
            <label className="text-sm font-medium col-span-1">
              Project/Location <span className="text-red-500">*</span>
            </label>
            <div className="col-span-4">
              <input
                type="text"
                placeholder="Select Project"
                value={state.project}
                onChange={(e) => setTimecardState({ project: e.target.value })}
                className="border rounded px-3 py-2 text-sm w-full"
              />
            </div>
            <label className="text-sm font-medium col-span-1">
              Service Ticket
            </label>
            <div className="col-span-4">
              <select
                value={state.serviceTicket}
                onChange={(e) =>
                  setTimecardState({ serviceTicket: e.target.value })
                }
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
                value={state.costCode}
                onChange={(e) => setTimecardState({ costCode: e.target.value })}
                className="border rounded px-3 py-2 text-sm w-full"
              >
                <option value="">Unassigned</option>
                <option value="CC-001">CC-001</option>
                <option value="CC-002">CC-002</option>
              </select>
            </div>
            <div className="col-span-5 flex justify-end">
              <button
                className="bg-black hover:bg-gray-400 text-white px-4 py-2 rounded-full text-sm"
                onClick={() => {
                  if (state.project && state.costCode) {
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
      ) : (
        <div className="flex items-center justify-center mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  {/* Clock circle */}
                  <div className="w-24 h-24 rounded-full border-4 border-[#9900ff] flex items-center justify-center relative">
                    {/* Rotating arrow */}
                    <div
                      className={`absolute top-2 left-1/2 w-0.5 h-8 bg-[#9900ff] origin-bottom rounded-full ${
                        state.isTimerRunning ? "animate-rotate-clock-hand" : ""
                      }`}
                      style={{
                        transform: state.isTimerRunning
                          ? "translateX(-50%)"
                          : "rotate(0deg) translateX(-50%)",
                        transition: "transform 0.3s ease-out",
                      }}
                    ></div>
                  </div>
                  {/* Time display */}
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-2 py-1 rounded text-sm">
                      {formatTime(state.seconds)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleClockIn}
                  disabled={state.isTimerRunning}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clock In
                </button>
                <button
                  onClick={handleClockOut}
                  disabled={!state.isTimerRunning}
                  className="bg-[#e94f37] hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clock Out
                </button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-sm w-72 space-y-2 shadow-inner">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Project</span>
                <span className="text-gray-800">{state.project || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">
                  Service Ticket
                </span>
                <span className="text-gray-800">
                  {state.serviceTicket || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Cost Code</span>
                <span className="text-gray-800">{state.costCode || "-"}</span>
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
