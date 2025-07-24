import type { HistoryEntry } from "./TimecardApp";

type Props = {
  currentHistory: HistoryEntry[];
  formatDateForDisplay: (dateStr: string) => string;
  selectedDate: string;
};

const TimelineHistory = ({
  currentHistory,
  formatDateForDisplay,
  selectedDate,
}: Props) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      History - {formatDateForDisplay(selectedDate)}
    </h3>
    <div className="border-l-2 border-gray-300 pl-4 space-y-6">
      {currentHistory.length > 0 ? (
        currentHistory.map((entry, index) => (
          <div key={index} className="relative">
            <div
              className={`absolute -left-2 top-1 w-3 h-3 rounded-full ${
                entry.type === "timecard"
                  ? "bg-[#bb0000]"
                  : entry.type === "crewcard"
                  ? "bg-black"
                  : "bg-[#e94f37]"
              }`}
            ></div>
            <div className="text-sm text-gray-600 font-mono mb-1 pl-3">
              {entry.time}
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded shadow-sm text-sm text-gray-800 pl-3">
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    entry.type === "timecard"
                      ? "bg-[#bb0000]"
                      : entry.type === "crewcard"
                      ? "bg-black"
                      : "bg-[#e94f37]"
                  }`}
                ></span>
                <span className="font-medium">{entry.action}</span>
              </div>
              {entry.data && (
                <div className="mt-2 text-xs text-gray-600 pl-4">
                  {entry.data.project && (
                    <div>Project: {entry.data.project}</div>
                  )}
                  {entry.data.projectLocation && (
                    <div>Project: {entry.data.projectLocation}</div>
                  )}
                  {entry.data.sheetProject && (
                    <div>Project: {entry.data.sheetProject}</div>
                  )}
                  {entry.data.employee && (
                    <div>Employee: {entry.data.employee}</div>
                  )}
                  {entry.data.sheetEmployee && (
                    <div>Employee: {entry.data.sheetEmployee}</div>
                  )}
                  {entry.data.supervisor && (
                    <div>Supervisor: {entry.data.supervisor}</div>
                  )}
                  {entry.data.sheetSupervisor && (
                    <div>Supervisor: {entry.data.sheetSupervisor}</div>
                  )}
                  {entry.data.totalHours && (
                    <div>Total Hours: {entry.data.totalHours}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 italic pl-3">
          No history for this date
        </p>
      )}
    </div>
  </div>
);

export default TimelineHistory;
