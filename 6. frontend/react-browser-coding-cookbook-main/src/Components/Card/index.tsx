import { ReactElement, ReactNode } from "react";
import "./card.css";

export interface CardProps {
  title?: ReactNode;
  subTitle?: ReactNode;
  headerElement?: ReactNode;
  footerElement?: ReactNode;
  children?: ReactNode;
}

const Card = ({
  children,
  title,
  subTitle,
  headerElement,
  footerElement
}: CardProps) => {

  return (
    <div className="card-container">
      <div className="card-wrapper">
        {(title || subTitle || headerElement) && (
          <header className="card-header-wrapper">
            <div className="card-header">
              {title && (typeof title === "string" ? <h3 className="card-title">{title}</h3> : title)}
            </div>
            <div className="card-subheader">
              {subTitle && (typeof subTitle === "string" ? <h5 className="card-title">{subTitle}</h5> : subTitle)}
            </div>
          </header>
        )}
        <div className="card-content">
          {children}
        </div>
        {footerElement && <div className="card-footer">
          {footerElement}
          </div>
        }
      </div>
    </div>
  )
}

export default Card;
