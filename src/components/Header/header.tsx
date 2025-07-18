import { FiSidebar } from "react-icons/fi";

interface HeaderProps {
  onSidebarToggle: () => void;
  title: string;
}

const Header = ({ onSidebarToggle, title }: HeaderProps) => {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between py-4">
      <button
        onClick={onSidebarToggle}
        className="text-2xl text-black hover:text-[#e94f37] transition-colors duration-200"
      >
        <FiSidebar />
      </button>
      <h1 className="text-xl font-semibold text-black">{title}</h1>
    </header>
  );
};

export default Header;
