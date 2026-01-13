import { NextPrevButtonProps } from "./type";

const NextPrevButton = ({
  handleNextClick,
  handlePrevClick,
}: NextPrevButtonProps) => {
  return (
    <div className="next-prev-cta-container">
      <button className="prev_cta" onClick={handlePrevClick}></button>
      <button className="next_cta" onClick={handleNextClick}></button>
    </div>
  )
}

export default NextPrevButton;