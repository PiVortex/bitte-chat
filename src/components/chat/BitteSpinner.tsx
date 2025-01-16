import Lottie from "react-lottie-player/dist/LottiePlayerLight";
import bitteAnimation from "./../../assets/bitte_animation.json";

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const calculateFilter = (r: number, g: number, b: number) => {
  const invert = 1 - r / 255;
  const sepia = g / 255;
  const saturate = b / 255;
  return `invert(${invert}) sepia(${sepia}) saturate(${saturate})`;
};

export const BitteSpinner = ({
  width = 200,
  height = 200,
}: {
  width?: number;
  height?: number;
}) => {
  const { r, g, b } = hexToRgb('#FF0000');
  const filter = calculateFilter(r, g, b);

  console.log({filter})

  return (
    <div>
      <Lottie
        loop
        animationData={bitteAnimation}
        play
        speed={1.5}
        style={{ width, height, filter }}
      />
    </div>
  );
};
