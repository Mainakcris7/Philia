import { TailSpin } from "react-loader-spinner";

export default function CircleLoading({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) {
  return (
    <TailSpin
      visible={true}
      height={height || "80"}
      width={width || "80"}
      color="white"
      ariaLabel="tail-spin-loading"
      radius="1"
      strokeWidth="4"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}
