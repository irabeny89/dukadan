import { swagger } from "@elysiajs/swagger";
import { config } from "../config";

// ? docs path `/api/swagger` by default
// ? more info: https://elysiajs.com/plugins/swagger
export const swaggerConfig = swagger({
  documentation: {
    tags: [
      { name: "Auth", description: "Authentication & Authorization Endpoints" },
      { name: "Feedback", description: "Customer Feedback Messages" },
    ],
    info: {
      title: "GasRefill API Documentations",
      version: config.semVer,
    },
  },
});
