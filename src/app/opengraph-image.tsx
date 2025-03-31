import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";

// Create reusable options object
let imageOptions: any = null;

// Initialize fonts
async function initializeFonts() {
  if (imageOptions) return imageOptions;

  try {
    imageOptions = {
      width: 1200,
      height: 800,
    };

    return imageOptions;
  } catch (error) {
    throw error;
  }
}

export default async function Image() {
  const options = await initializeFonts();

  const BACKGROUND_GRADIENT_START = "#c026d3";
  const BACKGROUND_GRADIENT_END = "#ef4444";
  const BACKGROUND_GRADIENT_STYLE = {
    backgroundImage: `linear-gradient(to bottom, ${BACKGROUND_GRADIENT_START}, ${BACKGROUND_GRADIENT_END})`,
    color: "white",
  };

  /*
this Image is rendered using vercel/satori.

Satori supports a limited subset of HTML and CSS features, due to its special use cases. In general, only these static and visible elements and properties that are implemented.
For example, the <input> HTML element, the cursor CSS property are not in consideration. And you can't use <style> tags or external resources via <link> or <script>.
Also, Satori does not guarantee that the SVG will 100% match the browser-rendered HTML output since Satori implements its own layout engine based on the SVG 1.1 spec.
Please refer to Satori’s documentation for a list of supported HTML and CSS features. https://github.com/vercel/satori#css
*/
  return new ImageResponse(
    (
      <div
        tw="h-full w-full flex flex-col justify-center items-center relative"
        style={BACKGROUND_GRADIENT_STYLE}
      >
        <h1 tw="text-9xl text-center font-semibold">{PROJECT_TITLE}</h1>
        <h3 tw="text-4xl font-normal">{PROJECT_DESCRIPTION}</h3>
      </div>
    ),
    options,
  );
}
