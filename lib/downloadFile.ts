export function downloadTextFile(filename: string, content: string) {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for Firefox
  element.click();
  document.body.removeChild(element);
}
