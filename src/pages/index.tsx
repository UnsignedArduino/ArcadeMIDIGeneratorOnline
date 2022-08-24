import * as React from "react";
import type { HeadFC } from "gatsby";
import { generateImages, onFileChange } from "../scripts/ArcadeMIDI Generator";
import { MidiFile } from "midifile-ts";

const IndexPage = () => {
  const fileInput = React.useRef(null);
  const [status, setStatus] = React.useState("No file selected.");

  const onChange = (): void => {
    onFileChange(fileInput.current!, (file: MidiFile | null) => {
      if (file != null) {
        setStatus("Processing MIDI file...");

        const images: string[] = generateImages(file);
        console.log(images);

        setStatus("Done!");
      } else {
        setStatus("Could not parse MIDI file!");
      }
    });
  };

  return (
    <main>
      <h1>ArcadeMIDI Generator</h1>
      <p>
        Upload your MIDI files to convert them to images compatible with the
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
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => {
  return <title>ArcadeMIDI Generator</title>;
};
