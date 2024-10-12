import Elysia from "elysia";
import { Feedback, feedbackSchema } from "../models/feedback.model";
import { permit } from "../services/permit.service";
import type { ResponseT } from "../types";

const API_DOC_TAG = "Feedback";
const feedback = new Elysia({ name: "feedback" })
	.model("feedback", feedbackSchema)
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
			tags: [API_DOC_TAG],
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
			tags: [API_DOC_TAG],
			body: "feedback",
			permit: ["customer"],
		},
	);

export default feedback;
