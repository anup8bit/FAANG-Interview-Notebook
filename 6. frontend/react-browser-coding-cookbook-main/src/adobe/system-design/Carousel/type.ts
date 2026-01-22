export interface SlideProps {
  url: string;
  title: string;
}

export interface CarouselProps {
  slides: SlideProps[];
  startIndex: number;
  infinitLoop?: boolean;
}

export interface NextPrevButtonProps {
  handlePrevClick: () => void;
  handleNextClick: () => void;
}