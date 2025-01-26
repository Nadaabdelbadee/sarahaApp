import mongoose from "mongoose";

const connectionDB = async () => {
  await mongoose
    .connect(process.env.URI_CONNECTION)
    .then(() => {
      console.log("connected to mongoose sucessgully");
    })
    .catch((error) => {
      console.log("cannot connected to mongoose");
    });
};

export default connectionDB