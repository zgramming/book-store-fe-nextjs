import { createContext, useState } from 'react';

type ContextProps = {
  openedSidebar: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const defaultValues: ContextProps = {
  openedSidebar: false,
  openSidebar: () => {},
  toggleSidebar: () => {},
  closeSidebar: () => {},
};

export const SidebarLayoutContext = createContext<ContextProps>(defaultValues);

function SidebarLayoutProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prevValue) => !prevValue);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    open();
  };

  return (
    <SidebarLayoutContext.Provider value={{ openedSidebar: isSidebarOpen, toggleSidebar, closeSidebar, openSidebar }}>
      {children}
    </SidebarLayoutContext.Provider>
  );
}

export default SidebarLayoutProvider;
