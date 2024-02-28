export type Data = Record<string, JSONValue>

export type JSONValue =
    | string
    | number
    | boolean
    | { [x: string]: JSONValue }
    | JSONValue[];
