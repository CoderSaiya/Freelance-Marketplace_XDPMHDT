import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from "@fortawesome/free-solid-svg-icons";

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {Array(fullStars).fill(<FontAwesomeIcon icon={faStar} className="text-yellow-500" />)}
      {halfStar && <FontAwesomeIcon icon={faStarHalfAlt} className="text-yellow-500" />}
      {Array(emptyStars).fill(<FontAwesomeIcon icon={faStarEmpty} className="text-gray-300" />)}
    </>
  );
};

export default renderStars;
