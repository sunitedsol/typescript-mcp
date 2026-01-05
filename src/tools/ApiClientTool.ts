import axios from 'axios';
import { z } from 'zod';

// Schema for API request configuration
const apiRequestSchema = z.object({
  url: z.string().describe("The API endpoint URL"),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).describe("HTTP method"),
  headers: z.record(z.string()).optional().describe("Request headers"),
  body: z.any().optional().describe("Request body for POST/PUT/PATCH requests"),
  params: z.record(z.string()).optional().describe("Query parameters"),
  timeout: z.number().optional().describe("Request timeout in milliseconds").default(30000)
});

// Schema for authenticated requests
const authenticatedRequestSchema = apiRequestSchema.extend({
  authType: z.enum(['bearer', 'api-key', 'basic']).optional().describe("Authentication type"),
  token: z.string().optional().describe("Bearer token or API key"),
  username: z.string().optional().describe("Username for basic auth"),
  password: z.string().optional().describe("Password for basic auth"),
  apiKeyHeader: z.string().optional().describe("Header name for API key (e.g., 'X-API-Key')")
});

export class ApiClientTool {
    
    getToolDefinitions() {
        return [
            {
                name: "make-api-request",
                description: "Make HTTP requests to any API endpoint with support for various authentication methods",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: {
                            type: "string",
                            description: "The API endpoint URL"
                        },
                        method: {
                            type: "string",
                            enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                            description: "HTTP method"
                        },
                        headers: {
                            type: "object",
                            description: "Request headers as key-value pairs",
                            additionalProperties: { type: "string" }
                        },
                        body: {
                            description: "Request body for POST/PUT/PATCH requests"
                        },
                        params: {
                            type: "object",
                            description: "Query parameters as key-value pairs",
                            additionalProperties: { type: "string" }
                        },
                        authType: {
                            type: "string",
                            enum: ["bearer", "api-key", "basic"],
                            description: "Authentication type"
                        },
                        token: {
                            type: "string",
                            description: "Bearer token or API key"
                        },
                        username: {
                            type: "string",
                            description: "Username for basic auth"
                        },
                        password: {
                            type: "string",
                            description: "Password for basic auth"
                        },
                        apiKeyHeader: {
                            type: "string",
                            description: "Header name for API key (e.g., 'X-API-Key')"
                        },
                        timeout: {
                            type: "number",
                            description: "Request timeout in milliseconds",
                            default: 30000
                        }
                    },
                    required: ["url", "method"]
                }
            }
        ];
    }

    async handleApiRequest(name: string, args: any) {
        if (name !== "make-api-request") {
            return null;
        }

        try {
            // Validate input
            const validatedArgs = authenticatedRequestSchema.parse(args);
            
            // Prepare request configuration
            const config: any = {
                url: validatedArgs.url,
                method: validatedArgs.method,
                timeout: validatedArgs.timeout,
                headers: validatedArgs.headers || {},
                params: validatedArgs.params,
                data: validatedArgs.body
            };

            // Handle authentication
            this.addAuthentication(config, validatedArgs);

            // Make the request
            const response: any = await axios(config);

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers,
                            data: response.data,
                            url: response.config?.url,
                            method: response.config?.method?.toUpperCase()
                        }, null, 2)
                    }
                ]
            };

        } catch (error: any) {
            const errorMessage = this.formatError(error);
            
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: false,
                            error: errorMessage,
                            status: error.response?.status,
                            statusText: error.response?.statusText,
                            url: error.config?.url,
                            method: error.config?.method?.toUpperCase()
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    }

    private addAuthentication(config: any, args: any) {
        if (!args.authType) return;

        switch (args.authType) {
            case 'bearer':
                if (args.token) {
                    config.headers!['Authorization'] = `Bearer ${args.token}`;
                }
                break;
            
            case 'api-key':
                if (args.token && args.apiKeyHeader) {
                    config.headers![args.apiKeyHeader] = args.token;
                }
                break;
            
            case 'basic':
                if (args.username && args.password) {
                    const credentials = Buffer.from(`${args.username}:${args.password}`).toString('base64');
                    config.headers!['Authorization'] = `Basic ${credentials}`;
                }
                break;
        }
    }

    private formatError(error: any): string {
        if (error.response) {
            // Server responded with error status
            return `HTTP ${error.response.status}: ${error.response.statusText}. ${
                error.response.data ? JSON.stringify(error.response.data) : ''
            }`;
        } else if (error.request) {
            // Request was made but no response received
            return `Network error: No response received. ${error.message}`;
        } else {
            // Something else happened
            return `Request error: ${error.message}`;
        }
    }
}