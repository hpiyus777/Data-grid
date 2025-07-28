import { useEffect } from "react";
import type { HistoryData, HistoryEntry } from "./TimecardApp";

type Props = {
  selectedDate: string;
  setHistoryData: React.Dispatch<React.SetStateAction<HistoryData>>;
  historyData: HistoryData;
  crewSheetState?: {
    isFormSubmitted: boolean;
    isTimerRunning: boolean;
    seconds: number;
    sheetEmployee: string;
    sheetSupervisor: string;
    sheetProject: string;
    sheetCostCode: string;
    sheetNotes: string;
  };
  setCrewSheetState: (
    state: Partial<{
      isFormSubmitted: boolean;
      isTimerRunning: boolean;
      seconds: number;
      sheetEmployee: string;
      sheetSupervisor: string;
      sheetProject: string;
      sheetCostCode: string;
      sheetNotes: string;
    }>
  ) => void;
};

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
  sheetEmployee: "",
  sheetSupervisor: "",
  sheetProject: "",
  sheetCostCode: "",
  sheetNotes: "",
};

const CrewSheetView = ({
  selectedDate,
  setHistoryData,
  crewSheetState,
  setCrewSheetState,
}: Props) => {
  const state = crewSheetState || defaultState;

  useEffect(() => {
    let interval: number | undefined;
    if (state.isTimerRunning) {
      interval = window.setInterval(() => {
        setCrewSheetState({ seconds: (state.seconds || 0) + 1 });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [state.isTimerRunning, state.seconds]);

  useEffect(() => {
    if (!crewSheetState) {
      setCrewSheetState(defaultState);
    }
    // eslint-disable-next-line
  }, [selectedDate]);

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
        sheetEmployee: state.sheetEmployee,
        sheetSupervisor: state.sheetSupervisor,
        sheetProject: state.sheetProject,
        sheetCostCode: state.sheetCostCode,
        sheetNotes: state.sheetNotes,
      },
    };
    setHistoryData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setCrewSheetState({
      isFormSubmitted: true,
      isTimerRunning: true,
      seconds: 0,
    });
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
      data: { totalHours: formatTime(state.seconds) },
    };
    setHistoryData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));
    setCrewSheetState({
      isFormSubmitted: false,
      isTimerRunning: false,
      seconds: 0,
      sheetEmployee: "",
      sheetSupervisor: "",
      sheetProject: "",
      sheetCostCode: "",
      sheetNotes: "",
    });
  };

  return (
    <>
      {!state.isFormSubmitted && (
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
                  value={state.sheetEmployee}
                  onChange={(e) =>
                    setCrewSheetState({ sheetEmployee: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Enter employee name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Supervisor <span className="text-red-500">*</span>
                </label>
                <input
                  value={state.sheetSupervisor}
                  onChange={(e) =>
                    setCrewSheetState({ sheetSupervisor: e.target.value })
                  }
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
                  value={state.sheetProject}
                  onChange={(e) =>
                    setCrewSheetState({ sheetProject: e.target.value })
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
                  value={state.sheetCostCode}
                  onChange={(e) =>
                    setCrewSheetState({ sheetCostCode: e.target.value })
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
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Work Description
              </label>
              <textarea
                value={state.sheetNotes}
                onChange={(e) =>
                  setCrewSheetState({ sheetNotes: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Enter work description..."
                rows={4}
              />
            </div>
          </div>
          <div className="mt-6 text-right">
            <button
              className="bg-black hover:bg-gray-400 text-white px-6 py-2 rounded-lg"
              onClick={() => {
                if (
                  state.sheetEmployee &&
                  state.sheetSupervisor &&
                  state.sheetProject &&
                  state.sheetCostCode
                ) {
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

      {state.isFormSubmitted && (
        <div className="flex items-center justify-center mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-[#e94f37] flex items-center justify-center">
                    <div
                      className={`absolute top-2 left-1/2 w-0.5 h-8 bg-[#e94f37] origin-bottom rounded-full ${
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
                  onClick={handleSheetClockIn}
                  disabled={state.isTimerRunning}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg"
                >
                  Clock In
                </button>
                <button
                  onClick={handleSheetClockOut}
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
                  {state.sheetProject || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Cost Code</span>
                <span className="text-gray-800">
                  {state.sheetCostCode || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Supervisor</span>
                <span className="text-gray-800">
                  {state.sheetSupervisor || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Employee</span>
                <span className="text-gray-800">
                  {state.sheetEmployee || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Work Desc</span>
                <span className="text-gray-800 truncate">
                  {state.sheetNotes || "-"}
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
