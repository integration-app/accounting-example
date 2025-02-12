import { Connection, Promise } from "mongoose";

declare global {
  let mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}
