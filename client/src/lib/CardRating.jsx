import { IoStar, IoStarHalf } from "react-icons/io5";

export const CardRating = ({ children }) => {
  const rating = parseFloat(children);

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <IoStar
          key={`full-${i}`}
          className="text-yellow-400 shadow-black shadow-xl"
        />
      );
    }

    if (halfStar) {
      stars.push(
        <IoStarHalf
          key="half"
          className="text-yellow-400 shadow-black shadow-xl"
        />
      );
    }

    return stars;
  };

  return <div className="flex">{renderStars()}</div>;
};
