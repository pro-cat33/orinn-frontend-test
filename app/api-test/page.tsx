"use client";

import { useState } from "react";
import apiClient from "@/lib/api";

export default function ApiTestPage() {
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState<"GET" | "POST" | "PATCH" | "PUT" | "DELETE">("GET");
  const [token, setToken] = useState("");
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [bodyError, setBodyError] = useState<string | null>(null);

  const validateJson = (jsonString: string): boolean => {
    if (!jsonString.trim()) return true; // Empty is valid
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    if (value.trim() && !validateJson(value)) {
      setBodyError("Invalid JSON format");
    } else {
      setBodyError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    if (!endpoint.trim()) {
      setError("Endpoint is required");
      return;
    }

    // Validate JSON body if provided
    if (body.trim() && !validateJson(body)) {
      setBodyError("Invalid JSON format");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare request config
      const config: any = {};

      // Add token to headers if provided
      if (token.trim()) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      // Parse body if provided
      let requestBody = null;
      if (body.trim() && (method === "POST" || method === "PATCH" || method === "PUT")) {
        try {
          requestBody = JSON.parse(body);
        } catch {
          setError("Invalid JSON in body");
          setIsLoading(false);
          return;
        }
      }

      // Make the request
      let result;
      const endpointUrl = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

      switch (method) {
        case "GET":
          result = await apiClient.get(endpointUrl, config);
          break;
        case "POST":
          result = await apiClient.post(endpointUrl, requestBody || {}, config);
          break;
        case "PATCH":
          result = await apiClient.patch(endpointUrl, requestBody || {}, config);
          break;
        case "PUT":
          result = await apiClient.put(endpointUrl, requestBody || {}, config);
          break;
        case "DELETE":
          result = await apiClient.delete(endpointUrl, config);
          break;
      }

      setResponse({
        status: result.status,
        statusText: result.statusText,
        headers: result.headers,
        data: result.data,
      });
    } catch (err: any) {
      if (err.response) {
        // Server responded with error
        setResponse({
          status: err.response.status,
          statusText: err.response.statusText,
          headers: err.response.headers,
          data: err.response.data,
        });
      } else {
        // Network or other error
        setError(err.message || "Request failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatJson = (obj: any): string => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 py-12 dark:from-zinc-900 dark:to-zinc-800">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            API Communication Test
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Test API endpoints with different methods and configurations
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Request Panel */}
          <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-800">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Endpoint */}
              <div>
                <label
                  htmlFor="endpoint"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Endpoint
                </label>
                <div className="mt-1 flex rounded-lg shadow-sm">
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-400">
                    /api/v1/
                  </span>
                  <input
                    id="endpoint"
                    type="text"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    placeholder="auth/login"
                    className="block w-full rounded-r-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
                  />
                </div>
              </div>

              {/* Method Selection */}
              <div>
                <label
                  htmlFor="method"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Method
                </label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) =>
                    setMethod(
                      e.target.value as "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
                    )
                  }
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PATCH">PATCH</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>

              {/* Token */}
              <div>
                <label
                  htmlFor="token"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Authorization Token (Bearer)
                </label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter your access token"
                  className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
                />
              </div>

              {/* Body */}
              {(method === "POST" || method === "PATCH" || method === "PUT") && (
                <div>
                  <label
                    htmlFor="body"
                    className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Request Body (JSON)
                  </label>
                  <textarea
                    id="body"
                    value={body}
                    onChange={(e) => handleBodyChange(e.target.value)}
                    placeholder='{"key": "value"}'
                    rows={8}
                    className={`mt-1 block w-full rounded-lg border px-4 py-2 font-mono text-sm focus:outline-none focus:ring-2 dark:bg-zinc-700 dark:text-zinc-50 ${
                      bodyError
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600"
                        : "border-zinc-300 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-600"
                    }`}
                  />
                  {bodyError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {bodyError}
                    </p>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !!bodyError}
                className="w-full rounded-lg bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending Request...
                  </span>
                ) : (
                  "Send Request"
                )}
              </button>
            </form>
          </div>

          {/* Response Panel */}
          <div className="rounded-2xl bg-white p-6 shadow-xl dark:bg-zinc-800">
            <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Response
            </h2>

            {response ? (
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        response.status >= 200 && response.status < 300
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {response.status} {response.statusText}
                    </span>
                  </div>
                </div>

                {/* Headers */}
                {response.headers && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Headers
                    </h3>
                    <pre className="max-h-40 overflow-auto rounded-lg bg-zinc-100 p-3 text-xs dark:bg-zinc-900">
                      {formatJson(response.headers)}
                    </pre>
                  </div>
                )}

                {/* Response Data */}
                <div>
                  <h3 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Response Data
                  </h3>
                  <pre className="max-h-96 overflow-auto rounded-lg bg-zinc-100 p-3 text-xs dark:bg-zinc-900">
                    {formatJson(response.data)}
                  </pre>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(formatJson(response));
                    alert("Response copied to clipboard!");
                  }}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                >
                  Copy Response
                </button>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No response yet. Send a request to see the response here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
