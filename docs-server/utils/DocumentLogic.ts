import DocumentModel, { IDocumentModel } from "../models/DocumentModel";

export const findOrCreateDoc = async (_id: string) => {
  try {
    if (!_id) return;
    const document = await DocumentModel.findById(_id);
    if (document) return document;
    const newDocument = new DocumentModel({
      _id: _id,
      data: {},
    });
    return await DocumentModel.create(newDocument);
  } catch (error) {
    throw new Error("Server Error, Could not get document.");
  }
};

export const updateDocument = async ({ _id, data }: IDocumentModel) => {
  try {
    await DocumentModel.findByIdAndUpdate(_id, { data: data });
  } catch (error) {
    throw new Error("Server Error, Document could be saved.");
  }
};
