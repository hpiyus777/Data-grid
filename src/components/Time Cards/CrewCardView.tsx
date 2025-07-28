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
  employee: "",
  supervisor: "",
  projectLocation: "",
  crewCostCode: "",
  notes: "",
};

const CrewCardView = ({
  selectedDate,
  setHistoryData,

  crewCardState,
  setCrewCardState,
}: Props) => {
  const state = crewCardState || defaultState;

  useEffect(() => {
    let interval: number | undefined;
    if (state.isTimerRunning) {
      interval = window.setInterval(() => {
        setCrewCardState({ seconds: (state.seconds || 0) + 1 });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [state.isTimerRunning, state.seconds]);

  useEffect(() => {
    if (!crewCardState) {
      setCrewCardState(defaultState);
    }
    // eslint-disable-next-line
  }, [selectedDate]);

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
      data: {
        employee: state.employee,
        supervisor: state.supervisor,
        projectLocation: state.projectLocation,
        crewCostCode: state.crewCostCode,
        notes: state.notes,
      },
    };
    setHistoryData((prev: any) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setCrewCardState({
      isFormSubmitted: true,
      isTimerRunning: true,
      seconds: 0,
    });
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
      data: { totalHours: formatTime(state.seconds) },
    };
    setHistoryData((prev: any) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setCrewCardState({
      isFormSubmitted: false,
      isTimerRunning: false,
      seconds: 0,
      employee: "",
      supervisor: "",
      projectLocation: "",
      crewCostCode: "",
      notes: "",
    });
  };

  return (
    <>
      {!state.isFormSubmitted && (
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
                value={state.employee}
                onChange={(e) => setCrewCardState({ employee: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Enter employee name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Supervisor <span className="text-red-500">*</span>
              </label>
              <input
                value={state.supervisor}
                onChange={(e) =>
                  setCrewCardState({ supervisor: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Enter supervisor name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Project/Location <span className="text-red-500">*</span>
              </label>
              <input
                value={state.projectLocation}
                onChange={(e) =>
                  setCrewCardState({ projectLocation: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Enter project location"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Cost Code <span className="text-red-500">*</span>
              </label>
              <select
                value={state.crewCostCode}
                onChange={(e) =>
                  setCrewCardState({ crewCostCode: e.target.value })
                }
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
              value={state.notes}
              onChange={(e) => setCrewCardState({ notes: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Add description..."
              rows={3}
            />
          </div>
          <div className="mt-6 text-right">
            <button
              className="bg-black hover:bg-gray-400 text-white px-6 py-2 rounded-lg"
              onClick={() => {
                if (
                  state.employee &&
                  state.supervisor &&
                  state.projectLocation &&
                  state.crewCostCode
                ) {
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

      {state.isFormSubmitted && (
        <div className="flex items-center justify-center mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-black flex items-center justify-center">
                    <div
                      className={`absolute top-2 left-1/2 w-0.5 h-8 bg-black origin-bottom rounded-full ${
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
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-2 py-1 rounded text-sm">
                      {formatTime(state.seconds)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCrewClockIn}
                  disabled={state.isTimerRunning}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Clock In
                </button>
                <button
                  onClick={handleCrewClockOut}
                  disabled={!state.isTimerRunning}
                  className="bg-[#e94f37] hover:bg-red-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Clock Out
                </button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-sm w-72 space-y-2 shadow-inner">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Project</span>
                <span className="text-gray-800">
                  {state.projectLocation || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Cost Code</span>
                <span className="text-gray-800">
                  {state.crewCostCode || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Supervisor</span>
                <span className="text-gray-800">{state.supervisor || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Employees</span>
                <span className="text-gray-800">{state.employee || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Notes</span>
                <span className="text-gray-800">{state.notes || "-"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CrewCardView;
