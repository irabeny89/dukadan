import Elysia from "elysia";
import { Setting } from "../models/setting.model";
import { permit } from "../services/permit.service";

const API_DOC_TAG = "Setting";
export const setting = new Elysia({ name: "setting" }).use(permit);
