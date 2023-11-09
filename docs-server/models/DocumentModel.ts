import { Schema, model } from "mongoose";

export type IDocumentModel = {
  _id: string;
  data: Object;
};

const documentSchema = new Schema({
  _id: String,
  data: { type: Object, default: {} },
});

export default model<IDocumentModel>("document", documentSchema);
