import { useState, useEffect } from "react";
import { Calendar as LucideCalendar, ChevronLeft } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Include default calendar styles

const TimecardApp = () => {
  const [, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  type HistoryEntry = { time: string; action: string };
  type HistoryData = { [date: string]: HistoryEntry[] };

  const [historyData, setHistoryData] = useState<HistoryData>({
    "2025-07-23": [
      { time: "11:50 AM", action: "Clocked In" },
      { time: "11:51 AM", action: "Clocked Out" },
    ],
    "2025-07-22": [
      { time: "09:30 AM", action: "Clocked In" },
      { time: "05:00 PM", action: "Clocked Out" },
    ],
  });

  useEffect(() => {
    let interval: number | undefined;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClockIn = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newEntry = { time: timeString, action: "Clocked In" };

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
    const newEntry = { time: timeString, action: "Clocked Out" };

    setHistoryData((prev) => ({
      ...prev,
      [selectedDate]: [...(prev[selectedDate] || []), newEntry],
    }));

    setIsTimerRunning(false);
  };

  const formatDateForDisplay = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const currentHistory = historyData[selectedDate] || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-80" : "w-0"
        } overflow-hidden`}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Calendar</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* React Calendar */}
          <div className="mb-4">
            <Calendar
              onChange={(date: any) => {
                const selected = new Date(date as Date);
                setSelectedDate(selected.toLocaleDateString("en-CA"));
                setCurrentDate(selected);
              }}
              value={new Date(selectedDate)}
              tileClassName={({ date }: { date: Date }) => {
                const dateStr = date.toLocaleDateString("en-CA");
                const isSelected = dateStr === selectedDate;
                const isToday =
                  dateStr === new Date().toLocaleDateString("en-CA");

                if (isSelected) return "bg-[#e94f37] text-white rounded";
                if (isToday) return "text-white rounded";
                return "";
              }}
            />
          </div>
        </div>

        {/* History Section */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">History</h3>
          </div>

          <div className="mb-2">
            <span className="text-sm bg-[#e94f37] text-white px-2 py-1 rounded">
              {formatDateForDisplay(selectedDate)}
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {currentHistory.map((entry, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {entry.time}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {entry.action}
                  </p>
                </div>
              </div>
            ))}
            {currentHistory.length === 0 && (
              <p className="text-sm text-gray-500 italic">
                No history for this date
              </p>
            )}
          </div>
        </div>
      </div>

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
          <div className="text-lg font-mono">
            Total Hours: {formatTime(totalSeconds)}
          </div>
        </div>

        {/* Main Timer Section */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Timer Display */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-2 py-1 rounded text-sm">
                      {formatTime(totalSeconds)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleClockIn}
                  disabled={isTimerRunning}
                  className="bg-black hover:bg-black disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clock In
                </button>
                <button
                  onClick={handleClockOut}
                  disabled={!isTimerRunning}
                  className="bg-[#e94f37] hover:bg-[#e94f37] disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clock Out
                </button>
              </div>
            </div>

            {/* Timeline History Below Timer */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                History - {formatDateForDisplay(selectedDate)}
              </h3>
              <div className="border-l-2 border-black pl-4 space-y-6">
                {currentHistory.length > 0 ? (
                  currentHistory.map((entry, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-2 top-1 w-3 h-3 bg-[#e94f37] rounded-full"></div>
                      <div className="text-sm text-gray-600 font-mono mb-1 pl-3">
                        {entry.time}
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded shadow-sm text-sm text-gray-800">
                        {entry.action}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No history for this date
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimecardApp;
