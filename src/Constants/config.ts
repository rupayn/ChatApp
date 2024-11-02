export const corsOptions = {
  origin: (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean), // Ensure no undefined values
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

export const CHAT_TOKEN = "ChatApp";
