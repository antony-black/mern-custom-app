import axios, { AxiosResponse, isAxiosError } from "axios";
import { env } from "../utils/env";

export const getResponseFromBrevo = async ({
  path,
  data,
}: {
  path: string;
  data: Record<string, any>;
}): Promise<AxiosResponse> => {
  try {
    const response = await axios({
      method: "POST",
      url: `https://api.brevo.com/v3/${path}`,
      headers: {
        accept: "application/json",
        "api-key": env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      data,
    });

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        `Brevo request failed: ${error.message} | Response: ${JSON.stringify(error.response?.data ?? {})}`,
      );
    }

    if (error instanceof Error) {
      throw new Error(`Unexpected error: ${error.message}`);
    }

    throw new Error("An unknown error occurred while calling Brevo API");
  }
};
