import { ReactElement, ReactNode } from "react"
import "./index.css";

interface ResponsiveLayoutProps {
  children: ReactNode;
  navBar?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  mainContent?: ReactNode;
}

const ResponsiveLayout = ({
  children,
  navBar,
  sidebar,
  footer,
  mainContent
}: ResponsiveLayoutProps): ReactElement | null => {
  return (
    <main className="page-container">
      <nav className="nav-bar">

      </nav>
      <aside className="aside-left-bar"></aside>
      <div className="main-content">
        {children}
      </div>
      <aside className="aside-right-bar"></aside>
      <footer className="footer-bar"></footer>
    </main>
  )
}

export default ResponsiveLayout;
