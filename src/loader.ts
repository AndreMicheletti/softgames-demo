import * as PIXI from "pixi.js";

export default class CustomLoader {
  public static async fetchAndConvertToPNG(
    name: string,
    url: string,
  ): Promise<void> {
    const reader = new FileReader();
    const img = new Image();
    const canvas = document.createElement("canvas");
    try {
      // Fetch the image data
      const response = await fetch(url);
      const blob = await response.blob();

      // Convert blob to canvas and render as PNG
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to get canvas context");
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Convert canvas to blob (PNG format)
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            // Convert blob to base64 URL
            reader.onload = () => {
              const base64Url = reader.result as string;
              // Load the PNG as a PIXI asset
              console.log("Adding asset: ", name.trim());
              console.log(base64Url);
              PIXI.Assets.load([{ alias: name.trim(), src: base64Url }]);
            };
            reader.readAsDataURL(pngBlob);
          }
        }, "image/png");
      };

      img.onerror = () => {
        console.error(`Failed to load image from ${url}`);
      };

      // Set source to trigger loading
      img.src = URL.createObjectURL(blob);
    } catch (error) {
      console.error(`Failed to fetch and convert image ${name}:`, error);
    }
  }
}
