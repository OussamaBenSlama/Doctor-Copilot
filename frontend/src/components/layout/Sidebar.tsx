
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Menu, Home, Users, User, Settings, BarChart4, CalendarClock, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };
  
  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      
      <aside
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto fixed lg:sticky top-0 left-0 z-40 w-64 shrink-0 transition-transform duration-200 ease-in-out ${
          isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-mindbridge-blue" />
              <span className="text-xl font-bold text-mindbridge-blue">MindBridge</span>
            </div>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-6 right-4"
                onClick={toggleSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <nav className="flex-1 p-4">
            <div className="space-y-1">
              <NavLink
                to="/"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-mindbridge-blue-light text-mindbridge-blue'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </NavLink>
              
              <NavLink
                to="/patients"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-mindbridge-blue-light text-mindbridge-blue'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Users className="mr-3 h-5 w-5" />
                Patients
              </NavLink>
              
              <NavLink
                to="/reports"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-mindbridge-blue-light text-mindbridge-blue'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <BarChart4 className="mr-3 h-5 w-5" />
                Reports
              </NavLink>
              
              <NavLink
                to="/calendar"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-mindbridge-blue-light text-mindbridge-blue'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <CalendarClock className="mr-3 h-5 w-5" />
                Calendar
              </NavLink>
              
              <NavLink
                to="/settings"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-mindbridge-blue-light text-mindbridge-blue'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </NavLink>
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={closeSidebar}
            >
              <User className="mr-2 h-4 w-4" />
              Dr. Sarah Wilson
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
