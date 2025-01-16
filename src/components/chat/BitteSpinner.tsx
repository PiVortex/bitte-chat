import Lottie from "react-lottie-player/dist/LottiePlayerLight";
import bitteAnimation from "./../../assets/bitte_animation.json";

export const BitteSpinner = ({
  width = 200,
  height = 200,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <div style={{ filter: `hue-rotate(#FF0000)` }}>
      <Lottie
        loop
        animationData={bitteAnimation}
        play
        speed={1.5}
        style={{ width, height }}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
          filterSize: {
            width: "150%",
            height: "150%",
            x: "-25%",
            y: "-25%",
          },
        }}
      />
    </div>
  );
};
