import React, { useEffect } from "react";
import { Image } from "../../scripts/ArcadeMIDI Generator";
import { copyTextToClipboard } from "../../scripts/Clipboard";

export const ImageListButton = ({ image }: { image: Image }) => {
  const self: React.RefObject<HTMLButtonElement> =
    React.useRef<HTMLButtonElement>(null);
  const [text, setText] = React.useState<string>("Image");

  const onClickCallback = () => {
    copyTextToClipboard(
      image.image,
      () => {
        setText("Copied!");
      },
      () => {
        setText(
          "Failed! View all the images as a TypeScript and copy the images manually."
        );
      }
    );
  };

  return (
    <button ref={self} type="button" onClick={onClickCallback}>
      {text} ({image.width}x{image.height})
    </button>
  );
};

export const ImageListTextArea = ({ images }: { images: Image[] }) => {
  const array: string =
    "[\n" +
    images
      .map((value: Image) => {
        return value.image;
      })
      .join(",\n") +
    "\n]";

  const [copyButtonText, setCopyButtonText] = React.useState<string>(
    "Copy all to clipboard"
  );
  const copy = () => {
    copyTextToClipboard(
      array,
      () => {
        setCopyButtonText("Copied!");
      },
      () => {
        setCopyButtonText("Failed! Try manually copying everything above.");
      }
    );
  };

  return (
    <>
      <textarea readOnly={true} value={array}></textarea>
      <br></br>
      <button type="button" onClick={copy}>
        {copyButtonText}
      </button>
    </>
  );
};

export const ImageList = ({ images }: { images: Image[] }) => {
  const [viewAsTS, setViewAsTS] = React.useState<boolean>(false);
  const toggleViewAsTS = () => setViewAsTS(!viewAsTS);

  return (
    <>
      {images.length > 0 ? (
        <>
          <p>Click to copy:</p>
          <p>
            (Alternatively, view all the images as a{" "}
            <button type="button" onClick={toggleViewAsTS}>
              {viewAsTS ? "list of buttons" : "TypeScript array"}
            </button>{" "}
            instead. )
          </p>
          {viewAsTS ? (
            <ImageListTextArea images={images} />
          ) : (
            <ol>
              {images.map((value: Image, index: number) => {
                return (
                  <li key={value.image}>
                    <ImageListButton image={value} />
                  </li>
                );
              })}
            </ol>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};
