// SideBar.tsx
// import { Link } from "react-router-dom"; // Use this if routing is implemented
import { SideBarValues } from "./SidebarValue";

function SideBar() {
  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-lg font-bold mb-4">Sidebar</h2>
      <ul>
        {SideBarValues.map((item) => (
          <li key={item.id} className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded-md">
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
