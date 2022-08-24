import { read, MidiFile } from "midifile-ts";

export const onFileChange = (
  input: HTMLInputElement,
  callback: (midi: MidiFile | null) => void
): void => {
  if (input.files === null || input.files.length === 0) {
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    if (e.target == null) {
      callback(null);
      return;
    }
    const buf = e.target.result as ArrayBuffer;
    const midi = read(buf);
    callback(midi);
  };

  reader.readAsArrayBuffer(file);
};

export const generateImages = (midi: MidiFile): void => {};
