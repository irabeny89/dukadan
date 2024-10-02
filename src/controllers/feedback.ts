import Elysia from "elysia";
import { cookieSchema } from "../models/user";
import { Feedback } from "../models/feedback";

const feedback = new Elysia({ name: "feedback" })
  .model("cookie", cookieSchema)
  .onBeforeHandle(() => {
		Feedback.createTable();
		Feedback.createUpdatedAtTrigger();
  })
  .get("/feedback", () => {}, { tags: ["Feedback"], cookie: "cookie" })

export default feedback