import * as React from "react";
import type { HeadFC } from "gatsby";
import {
  generateImages,
  Image,
  onFileChange,
} from "../scripts/ArcadeMIDI Generator";
import { ImageList as ImageList } from "../components/ImageList";
import { MidiFile } from "midifile-ts";

const IndexPage = () => {
  const fileInput: React.RefObject<HTMLInputElement> =
    React.useRef<HTMLInputElement>(null);
  const [status, setStatus] = React.useState<string>("No file selected.");
  const [images, setImages] = React.useState<Image[]>([]);

  const onChange = (): void => {
    onFileChange(fileInput.current!, (file: MidiFile | null) => {
      if (file != null) {
        setStatus("Processing MIDI file...");

        setTimeout(() => {
          // We want to run this on the next JavaScript cycle thingy so the UI updates first
          const result: Image[] = generateImages(file);
          console.log(result);

          setImages(result);

          let biggestWidth = 0;
          let biggestHeight = 0;

          result.map((value: Image) => {
            biggestWidth = Math.max(biggestWidth, value.width);
            biggestHeight = Math.max(biggestHeight, value.height);
          });

          setStatus(
            `Done! Make your animation block ${biggestWidth} by ${biggestHeight} pixels.`
          );
        }, 0);
      } else {
        setStatus("Could not parse MIDI file!");
      }
    });
  };

  return (
    <main>
      <h1>ArcadeMIDI Generator</h1>
      <p>
        Select a MIDI files to convert them to images compatible with the
        MakeCode Arcade extension{" "}
        <a href="https://github.com/UnsignedArduino/ArcadeMIDI">
          UnsignedArduino/ArcadeMIDI
        </a>
        !
      </p>

      <label htmlFor="midi_file">Select a file: </label>
      <input
        type="file"
        id="midi_file"
        name="midi_file"
        accept=".mid,.midi,audio/midi,audio/x-midi"
        ref={fileInput}
        onChange={onChange}
      ></input>

      <p>{status}</p>

      <ImageList images={images} />

      <br></br>
      <p>
        Star{" "}
        <a href="https://github.com/UnsignedArduino/ArcadeMIDIGeneratorOnline">
          ArcadeMIDIGeneratorOnline
        </a>{" "}
        and{" "}
        <a href="https://github.com/UnsignedArduino/ArcadeMIDI">ArcadeMIDI</a>{" "}
        on GitHub!
      </p>
      <p>
        Issues? Suggestions? Open an issue in their respective repositories! (
        <a href="https://github.com/UnsignedArduino/ArcadeMIDIGeneratorOnline/issues">
          ArcadeMIDIGeneratorOnline
        </a>{" "}
        or{" "}
        <a href="https://github.com/UnsignedArduino/ArcadeMIDI/issues">
          ArcadeMIDI
        </a>
        )
      </p>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => {
  return <title>ArcadeMIDI Generator</title>;
};
