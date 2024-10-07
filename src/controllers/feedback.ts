import Elysia from "elysia";
import { Feedback } from "../models/feedback";
import { cookieSchema } from "../models/user";
import { permit } from "../services/permit";

const feedback = new Elysia({ name: "feedback" })
	.model("cookie", cookieSchema)
	.onBeforeHandle(() => {
		Feedback.createTable();
		Feedback.createUpdatedAtTrigger();
	})
	.use(permit) // auth & rbac service
	.get(
		"/feedbacks",
		() => ({
			success: true,
			message: "List of feedbacks",
			data: Feedback.findAll(),
		}),
		{
			tags: ["Feedback"],
			cookie: "cookie",
			permit: ["owner"],
		},
	);

export default feedback;
