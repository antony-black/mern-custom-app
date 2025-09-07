import axios, { AxiosResponse } from "axios";

jest.mock("../env", () => ({
  env: {
    BREVO_API_KEY: "test-api-key",
  },
}));

import { makeRequestToBrevo } from "./make-request-to-brevo";

jest.mock("axios");
// const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedAxios = axios as unknown as jest.Mock;

describe("make request to brevo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockEmailBuilder = {
    path: "smtp/email",
    data: {
      subject: "Test Request",
      htmlContent: `<div>Hello</div>`,
      sender: { email: "sender@gmail.com", name: "sender" },
      to: "example@gmail.com",
    },
  };

  const mockApiRequest = {
    method: "POST",
    url: "https://api.brevo.com/v3/smtp/email",
    headers: {
      accept: "application/json",
      "api-key": "test-api-key",
      "content-type": "application/json",
    },
    data: mockEmailBuilder.data,
  };

  const mockApiResponse = {
    status: 201,
    statusText: "Created",
    data: {
      messageId: `<202509020618.11188281855@smtp-relay.mailin.fr>`,
    },
  };

  test("SUCCESS: get response", async () => {
    mockedAxios.mockResolvedValue(mockApiResponse);
    // mockedAxios.post.mockResolvedValue(new Response(JSON.stringify(mockApiResponse)));

    const response = await makeRequestToBrevo({ ...mockEmailBuilder, path: "smtp/email" });

    expect(mockedAxios).toHaveBeenCalledTimes(1);

    expect(mockedAxios).toHaveBeenCalledWith(mockApiRequest);

    expect(response.loggableResponse).toEqual(mockApiResponse);
  });

  test("ERROR: get an error", async () => {
    const mockErrorText = "Request failed with status code 404";
    const mockError = new Error(mockErrorText);
    mockedAxios.mockRejectedValueOnce(mockError);

    await expect(makeRequestToBrevo(mockEmailBuilder)).rejects.toThrow(mockErrorText);

    expect(mockedAxios).toHaveBeenCalledTimes(1);

    expect(mockedAxios).toHaveBeenCalledWith(mockApiRequest);
  });
});
