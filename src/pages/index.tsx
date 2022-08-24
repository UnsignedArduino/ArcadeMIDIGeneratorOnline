import * as React from "react";
import type { HeadFC } from "gatsby";

const IndexPage = () => {
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
      ></input>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => {
  return <title>ArcadeMIDI Generator</title>;
};
