import { useState } from "react";
import "./index.css";

const StarRating = ({ totalStar = 5, onChange }) => {
    const [ratings, setRatings] = useState(0);

    const handleClick = (val) => {
        setRatings(val);

        if (onChange && typeof onChange === 'function') {
            onChange(val);
        }
    }

    return (
        <div class="rating-container">
            {Array.from({length: totalStar}, (_, index) => {
                const starValue = index + 1;
                let starCtaClassNames = "star-rating-cta";
                if (starValue <= ratings) starCtaClassNames += " rated-cta";
                return (
                    <button
                        className={starCtaClassNames}
                        onClick={() => handleClick(starValue)}
                    >
                        ★
                    </button>
                )
            })}
        </div>
    )
}

export default StarRating;