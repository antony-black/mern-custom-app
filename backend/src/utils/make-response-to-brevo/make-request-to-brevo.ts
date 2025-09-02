import { type AxiosResponse } from "axios";
import _ from "lodash";
import { getResponseFromBrevo } from "../../helpers/get-response-from-brevo";
import { env } from "../env";

export const makeRequestToBrevo = async ({
  path,
  data,
}: {
  path: string;
  data: Record<string, any>;
}): Promise<{
  originalResponse?: AxiosResponse;
  loggableResponse: Pick<AxiosResponse, "status" | "statusText" | "data">;
}> => {
  if (!env.BREVO_API_KEY) {
    return {
      loggableResponse: {
        status: 200,
        statusText: "OK",
        data: { message: "BREVO_API_KEY is not defined." },
      },
    };
  }

  const response = await getResponseFromBrevo({ path, data });

  return {
    originalResponse: response,
    loggableResponse: _.pick(response, ["status", "statusText", "data"]),
  };
};
