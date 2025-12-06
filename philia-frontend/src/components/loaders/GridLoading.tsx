import { Grid } from "react-loader-spinner";

export default function GridLoading({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) {
  return (
    <Grid
      visible={true}
      height={height || "60"}
      width={width || "60"}
      color="white"
      ariaLabel="grid-loading"
      radius="12.5"
      wrapperStyle={{}}
      wrapperClass="grid-wrapper"
    />
  );
}
