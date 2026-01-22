interface SlideIndicatorProps {
  totalSlides: number;
  activeSlide: number;
}

const SlideIndicator = ({
  totalSlides,
  activeSlide
}: SlideIndicatorProps) => {
  return (
    <ul className="slide-indicator-container">
      {Array(totalSlides).fill(0).map((val, index) => (
        <li className="slide-indiactor">
          <button className="slide-indiactor-cta"></button>
        </li>
      ))}
    </ul>
  )
}

export default SlideIndicator;