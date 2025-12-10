type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | Record<string, boolean>
  | ClassValue[];

function toArray(value: ClassValue): string[] {
  if (!value) return [];
  if (typeof value === "string" || typeof value === "number") return [String(value)];
  if (Array.isArray(value)) return value.flatMap(toArray);
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, ok]) => ok)
      .map(([key]) => key);
  }
  return [];
}

export default function clsx(...values: ClassValue[]) {
  return values.flatMap(toArray).join(" ").trim();
}
