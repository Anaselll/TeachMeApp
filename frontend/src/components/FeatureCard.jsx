
import start from '../assets/start.png'
const FeatureCard = ({
  title,
  description,
  image,
  bgColor,
}) => {
  return (
    <div
      className={`rounded-2xl p-6 text-white ${bgColor} w-64 h-64 shadow-lg relative`}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm w-27 ml-25 mt-5">{description}</p>
      <img
        width="150"
        height="150"
        src={image}
        alt={title}
        className=" absolute bottom-0 left-0"
      />
      <img
        width="80"
        height="80"
        src={start}
        alt={title}
        className=" absolute bottom-1/5 right-0"
      />
    </div>
  );
};

export default FeatureCard;
