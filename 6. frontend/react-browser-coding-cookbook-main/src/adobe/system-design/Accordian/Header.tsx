import { HeaderProps } from "./type";

const Header = ({ ariaControl, title, open, toggle, setActiveIndex }: HeaderProps) => {
  const handleClick = () => {
    toggle();

    if (setActiveIndex) {
      setActiveIndex();
    }
  }
  return (
    <header className="accordian-header-wrapper">
      <button
        aria-controls={ariaControl}
        aria-expanded={open}
        className="accordian-header"
        onClick={handleClick}
      >
        <span>{title}</span>
        <span className={open ? "arrow-up" : "arrow-down"} aria-hidden="true" />
      </button>
    </header>
  );
}

export default Header;
