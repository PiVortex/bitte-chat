import Lottie from "react-lottie-player/dist/LottiePlayerLight";
import bitteAnimation from "./../../assets/bitte_animation.json";

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

function calculateFilter(r: number, g: number, b: number) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const invert = 1 - rNorm;
  const sepia = gNorm;
  const saturate = bNorm * 1000; // Example scaling
  const hueRotate = (Math.atan2(gNorm - bNorm, rNorm - gNorm) * 180) / Math.PI;

  return `invert(${invert}) sepia(${sepia}) saturate(${saturate}%) hue-rotate(${hueRotate}deg)`;
}
export const BitteSpinner = ({
  width = 200,
  height = 200,
}: {
  width?: number;
  height?: number;
}) => {
  const { r, g, b } = hexToRgb("#FF0000");
  console.log({ r, g, b });
  const filter = calculateFilter(r, g, b);

  console.log({ filter });

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
