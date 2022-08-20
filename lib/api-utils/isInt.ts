// Credit: https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript

export default function isInt(
  id: string | string[] | number | undefined
): boolean {
  let x;
  if (Number.isNaN(id)) {
    return false;
  }
  if (typeof id !== "string") {
    return false;
  }
  x = parseFloat(id);
  return (x | 0) === x;
}
