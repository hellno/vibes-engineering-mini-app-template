import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

export const alt = "Farcaster Frames V2 Demo";
export const size = {
  width: 600,
  height: 400,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div tw="h-full w-full flex flex-col justify-center items-center relative bg-white">
        <h1 tw="text-6xl">{PROJECT_TITLE}</h1>
        <h3 tw="text-2xl">{PROJECT_DESCRIPTION}</h3>
      </div>
    ),
    {
      ...size,
    }
  );
}
