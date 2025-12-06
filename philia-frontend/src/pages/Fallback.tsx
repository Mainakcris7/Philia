import type { FallbackProps } from "react-error-boundary";

export default function Fallback(props: FallbackProps) {
  return (
    <div className="w-full h-screen flex-1 flex justify-center items-center flex-col">
      <h1 className="text-3xl font-bold text-red-500">Something went wrong!</h1>
      <h1 className="mt-2">
        Error details:{" "}
        <span className="text-[1.25rem] text-red-500">
          {props.error.message || "Something went wrong"}
        </span>
      </h1>
    </div>
  );
}
