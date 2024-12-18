import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from "@fortawesome/free-solid-svg-icons";

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {Array(fullStars)
        .fill(null)
        .map((_, index) => (
          <FontAwesomeIcon key={`full-${index}`} icon={faStar} className="text-yellow-500" />
        ))}
      {halfStar && <FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-yellow-500" />}
      {Array(emptyStars)
        .fill(null)
        .map((_, index) => (
          <FontAwesomeIcon key={`empty-${index}`} icon={faStarEmpty} className="text-gray-300" />
        ))}
    </>
  );
};

export default renderStars;
