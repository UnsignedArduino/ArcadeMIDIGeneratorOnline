import {
  read,
  MidiFile,
  AnyEvent,
  NoteOnEvent,
  AnyChannelEvent,
} from "midifile-ts";

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

const mergeTracks = (tracks: Array<AnyEvent>[]): Array<AnyEvent> => {
  let msgs: Array<AnyEvent> = new Array();

  const toAbsTime = (messages: Array<AnyEvent>): Array<AnyEvent> => {
    let now = 0;
    const newMessages: Array<AnyEvent> = new Array();
    for (const message of messages) {
      now += message.deltaTime;
      const newMessage: AnyEvent = structuredClone(message);
      newMessage.deltaTime = now;
      newMessages.push(newMessage);
    }
    return newMessages;
  };

  const toRelTime = (messages: Array<AnyEvent>): Array<AnyEvent> => {
    let now = 0;
    const newMessages: Array<AnyEvent> = new Array();
    for (const message of messages) {
      const delta = message.deltaTime - now;
      const newMessage: AnyEvent = structuredClone(message);
      newMessage.deltaTime = delta;
      newMessages.push(newMessage);
      now = message.deltaTime;
    }
    return newMessages;
  };

  for (const track of tracks) {
    msgs.push(...toAbsTime(track));
  }

  msgs.sort((a: AnyEvent, b: AnyEvent): number => {
    return a.deltaTime - b.deltaTime;
  });

  msgs = toRelTime(msgs);

  return msgs;
};

const convertNoteOffToNoteOn = (track: Array<AnyEvent>): void => {
  for (let i = 0; i < track.length; i++) {
    if (
      track[i].type == "channel" &&
      (track[i] as AnyChannelEvent).subtype == "noteOff"
    ) {
      const newNote: AnyChannelEvent = structuredClone(
        track[i]
      ) as AnyChannelEvent;
      newNote.subtype = "noteOn";
      track[i] = newNote;
    }
  }
};

export const generateImages = (midi: MidiFile): string[] => {
  console.log("Generating images");

  const msgs = mergeTracks(midi.tracks);
  console.log(`Merged ${midi.tracks.length} tracks to ${msgs.length} messages`);
  convertNoteOffToNoteOn(msgs);

  const noteNumToName = (num: number): string => {
    const notes: string[] = [
      "A",
      "A#",
      "B",
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
    ];
    const octave = Math.ceil(num / 12);
    const name = notes[num % 12];
    return name + octave.toString();
  };

  const formatHex = (num: number, minLen: number = 0): string => {
    const rawHex: string = num.toString(16);
    let result: string = "";
    for (let i = rawHex.length; i < minLen; i++) {
      result += "0";
    }
    result += rawHex;
    return result;
  };

  const formatColumn = (
    time: number,
    velocity: number,
    notes: number[]
  ): string => {
    let column: string = formatHex(time, 8);
    column += formatHex(velocity, 2);
    const noteList = new Array(88 + 21).fill("0");
    for (const note of notes) {
      noteList[note] = noteNumToName(note - 21).indexOf("#") != -1 ? "f" : "1";
    }
    column += noteList.join("");
    column += "0";
    return column;
  };

  const image: string[] = [];
  let width = 0;

  let i = 0;

  while (
    msgs[i].type != "channel" ||
    (msgs[i] as AnyChannelEvent).subtype != "noteOn"
  ) {
    i++;
  }

  let lastTime: number = msgs[i].deltaTime;
  let lastVelocity: number = (msgs[i] as NoteOnEvent).velocity;
  let lastNotes: number[] = [(msgs[i] as NoteOnEvent).noteNumber];

  while (i < msgs.length) {
    let msg: AnyEvent = msgs[i];

    if (msg.type == "channel" && (msg as AnyChannelEvent).subtype == "noteOn") {
      // console.log(`Note message: ${msg}`);

      if (width == 0) {
        image.push(new Array(8 + 2 + (88 + 21)).fill("1").join("") + "0");
        image.push(
          new Array(8).fill("3").join("") +
            new Array(2).fill("2").join("") +
            new Array(88 + 21).fill("1").join("") +
            "0"
        );
        width = 2;
      }

      msg = msg as NoteOnEvent;

      if (lastTime != msg.deltaTime || lastVelocity != msg.velocity) {
        // console.log("Inserting new chord");

        image.push(formatColumn(lastTime, lastVelocity, lastNotes));
        width++;

        lastTime = msg.deltaTime;
        lastVelocity = msg.velocity;
        lastNotes = [msg.noteNumber];
      } else {
        // console.log("Appending to last chord");

        lastNotes.push(msg.noteNumber);
      }

      if (width == 512) {
        width = 0;
      }
    }

    i++;
  }

  const formatColumnsToImage = (
    columns: string[],
    prePad: string = "",
    startAt: number = 0
  ): string => {
    let grid = "";
    for (let y = 0; y < columns[0].length; y++) {
      grid += prePad;
      for (let x = startAt; x < Math.min(columns.length, startAt + 512); x++) {
        grid += columns[x][y] + " ";
      }
      grid += "\n";
    }
    return `${prePad}${grid}\n`;
  };

  const images: string[] = [];
  let imageCount = 0;

  for (let i = 0; i < image.length; i += 512 * 4) {
    let thisImageCode = "img`\n";
    let j: number = i;
    while (j < i + 512 * 4) {
      thisImageCode += formatColumnsToImage(image, "", j);
      j += 512;
    }
    thisImageCode += "`";
    images.push(thisImageCode);
    imageCount++;
  }

  console.log(`Generated ${imageCount} image(s)`);

  return images;
};
