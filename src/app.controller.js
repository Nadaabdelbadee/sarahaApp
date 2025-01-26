import connectionDB from "./DB/connectionDB.js";
import MessageRouter from "./modules/messages/messages.controller.js";
import userRouter from "./modules/users/users.controller.js";
import { globalErrorHandling } from "./utilities/errorHandling.js";

const bootstrap = (app, express) => {
  app.use(express.json());
  connectionDB();
  app.use("/users", userRouter);
  app.use("/message", MessageRouter);




  
  app.use("*", (req, res, next) => {
    return next(new Error(`invalid Url ${req.originalUrl}`))
  });



  app.use(globalErrorHandling)
};

export default bootstrap;
