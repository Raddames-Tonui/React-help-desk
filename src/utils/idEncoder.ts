import Hashids from "hashids";

const hashids = new Hashids("your-secret-salt", 8); 

export const encodeId = (id: number) => hashids.encode(id);
export const decodeId = (hash: string) => hashids.decode(hash)[0] as number;
