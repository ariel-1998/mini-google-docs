import { Server } from "socket.io";
import { corsOptions } from "./utils/corsOptions";
import { connectDB } from "./utils/mongooseConfig";
import { findOrCreateDoc, updateDocument } from "./utils/DocumentLogic";

connectDB();

const io = new Server(3000, { cors: corsOptions });
io.on("connection", (socket) => {
  socket.on("get-document", async (documentId: string) => {
    try {
      const document = await findOrCreateDoc(documentId);
      socket.join(documentId);
      socket.emit("load-document", document.data);
    } catch (error) {
      socket.emit("error", error.message);
    }
    socket.on("emit-quill-changes", (delta) => {
      socket.broadcast.to(documentId).emit("recive-quill-changes", delta);
    });

    socket.on("save-document", async (data) => {
      try {
        await updateDocument({ _id: documentId, data });
      } catch (error) {
        socket.emit("error", error.message);
      }
    });
  });
});
