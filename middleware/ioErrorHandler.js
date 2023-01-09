const ioErrorHandler = (err, socket) => {
  //mongoose validation err handler
  if (err.name == "ValidationError") {
    const errValues = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    return socket.emit("error", `Validation Error: ${errValues}`);
  }
  //mongoose Cast err handler
  if (err.name == "CastError") {
    return socket.emit("error", `No item Found with id ${err.value} `);
  }
  // default and custom err handler
  socket.emit("error", err.message || "something went wrong...");
};
module.exports = ioErrorHandler;
