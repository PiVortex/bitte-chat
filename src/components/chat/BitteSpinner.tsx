import bitteAnimation from "./../../assets/bitte_animation.json";
import Lottie from "react-lottie-player/dist/LottiePlayerLight";

export const BitteSpinner = ({
  width = 200,
  height = 200,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <div className="dark:invert">
      <Lottie
        loop
        animationData={bitteAnimation}
        play
        speed={1.5}
        style={{ width, height }}
      />
    </div>
  );
};
