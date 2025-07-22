import { Link } from "react-router-dom";
import { FaTimes, FaTable, FaChartPie } from "react-icons/fa";
import { MdListAlt } from "react-icons/md";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (title: string) => void;
}

const Sidebar = ({ isOpen, onClose, onSelect }: SidebarProps) => {
  const handleSelect = (title: string) => {
    onSelect(title);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-opacity-30 z-40" onClick={onClose}></div>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#393e41] text-white transform translate-x-0 transition-transform duration-300 z-50 shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold">Menu</h2>
          <button
            onClick={onClose}
            className="text-white text-xl hover:text-[#e94f37] transition-colors"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link
            to="/"
            onClick={() => handleSelect("DataGrid")}
            className="flex items-center gap-2 hover:text-[#e94f37] transition-colors"
          >
            <FaTable /> DataGrid
          </Link>
          <Link
            to="/dashboard"
            onClick={() => handleSelect("Dashboard - Chart")}
            className="flex items-center gap-2 hover:text-[#e94f37] transition-colors"
          >
            <FaChartPie /> Dashboard - Chart
          </Link>
          <Link
            to="/term-conditions"
            onClick={() => handleSelect("Terms and conditions")}
            className="flex items-center gap-2 hover:text-[#e94f37] transition-colors"
          >
            <MdListAlt /> Terms
          </Link>
          <Link
            to="/additem"
            onClick={() => handleSelect("Add Items")}
            className="flex items-center gap-2 hover:text-[#e94f37] transition-colors"
          >
            <MdListAlt /> Add Item
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
