import { CarouselProps } from "./type";
import "./index.css";
import SlideIndicator from "./SlideIndicator";
import NextPrevButton from "./NextPrevButton";
import { useState } from "react";

const Carousel = ({
  slides,
  startIndex = 0,
  infinitLoop = true,
}: CarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(startIndex);

  const getClassName = (index: number) => {
    let classNames = "slide-wrapper";

    if (index === activeSlide) {
      classNames += " active-slide"
    }

    return classNames;
  }

  const handleNextClick = () => {
    setActiveSlide((preActiveSlide) => {
      if (preActiveSlide === slides.length-1) return 0;
      return preActiveSlide+1;
    })
  }

  const handlePrevClick = () => {
    setActiveSlide((preActiveSlide) => {
      if (preActiveSlide === 0) return slides.length-1;
      return preActiveSlide-1;
    })
  }

  const renderSlides = () => {
    return slides.map((slide, index) => (
      <div className={getClassName(index)}>
        <img
          height="480px"
          src={slide.url}
          className="slide-image"
          alt="slide-alt-text"
        />
      </div>
    ))
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="slides-container">
          {renderSlides()}
        </div>
        <NextPrevButton handleNextClick={handleNextClick} handlePrevClick={handlePrevClick} />
        <SlideIndicator totalSlides={slides.length} activeSlide={0} />
      </div>
    </div>
  )
}

export default Carousel;
