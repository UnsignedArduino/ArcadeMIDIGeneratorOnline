// https://stackoverflow.com/a/30810322/10291933

const fallbackCopyTextToClipboard = (text: string) => {
  let textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    let successful = document.execCommand("copy");
    console.log(
      "Fallback: Copying text command was " + successful
        ? "successful"
        : "unsuccessful"
    );
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
};

export const copyTextToClipboard = (
  text: string,
  onSuccess: () => void,
  onFail: () => void
) => {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
  } else {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log("Async: Copying to clipboard was successful!");
        onSuccess();
      },
      (err) => {
        console.error("Async: Could not copy text: ", err);
        onFail();
      }
    );
  }
};
