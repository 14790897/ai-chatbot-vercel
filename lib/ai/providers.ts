import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
// import { openai } from '@ai-sdk/openai';
import { createOpenAI } from "@ai-sdk/openai";
// import { fireworks } from "@ai-sdk/fireworks";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { isTestEnvironment } from "../constants";
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from "./models.test";

const openai = createOpenAI({
  baseURL: process.env.CUSTOM_BASE_URL,
  apiKey: process.env.CUSTOM_API_KEY,
});

const deepseek = createDeepSeek({
  baseURL: process.env.CUSTOM_BASE_URL ?? "",
  apiKey: process.env.CUSTOM_API_KEY ?? "",
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        "chat-model-small": chatModel,
        "chat-model-large": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        "chat-model-small": deepseek("deepseek-ai/DeepSeek-V3"),
        "chat-model-large": openai("gpt-4o"),
        "chat-model-reasoning": wrapLanguageModel({
          model: deepseek("deepseek-ai/DeepSeek-R1"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": deepseek("deepseek-ai/DeepSeek-V3"),
        "artifact-model": openai("gpt-4o"),
      },
      imageModels: {
        "small-model": openai.image("dall-e-2"),
        "large-model": openai.image("dall-e-3"),
      },
    });
