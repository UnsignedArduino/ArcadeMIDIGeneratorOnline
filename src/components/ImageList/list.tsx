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
        setText("Failed!");
      }
    );
  };

  return (
    <button ref={self} type="button" onClick={onClickCallback}>
      {text} ({image.width}x{image.height})
    </button>
  );
};

export const ImageListOfButtons = ({ images }: { images: Image[] }) => {
  return (
    <>
      {images.length > 0 ? (
        <>
          <p>Click to copy:</p>
          <ol>
            {images.map((value: Image, index: number) => {
              return (
                <li key={value.image}>
                  <ImageListButton image={value} />
                </li>
              );
            })}
          </ol>{" "}
        </>
      ) : (
        <></>
      )}
    </>
  );
};
