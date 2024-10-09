import Elysia from "elysia";
import { cookieSchema } from "../models/customer";
import { Feedback, feedbackSchema } from "../models/feedback";
import { permit } from "../services/permit";
import type { ResponseT } from "../types";

const feedback = new Elysia({ name: "feedback" })
  .model("cookie", cookieSchema)
  .model("feedback", feedbackSchema)
  .onBeforeHandle(() => {
    Feedback.createTable();
    Feedback.createUpdatedAtTrigger();
  })
  .use(permit) // auth & rbac service
  .get(
    "/feedbacks",
    () => {
      const response: ResponseT = {
        success: true,
        message: "List of feedbacks",
        data: Feedback.findAll(),
      };

      return response;
    },
    {
      tags: ["Feedback"],
      cookie: "cookie",
      permit: ["owner"],
    },
  )
  .post(
    "/feedbacks",
    ({ store, body }) => {
      new Feedback(store.user.userId, body.message).save();
      const feedback = Feedback.findByUserId(store.user.userId);

      const response: ResponseT = {
        success: true,
        message: "Thank you for the feedback, necessary actions will be taken.",
        data: feedback,
      };

      return response;
    },
    {
      tags: ["Feedback"],
      cookie: "cookie",
      body: "feedback",
      permit: ["customer"],
    },
  );

export default feedback;
