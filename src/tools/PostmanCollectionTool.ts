import { z } from 'zod';
import fs from 'fs/promises';

// Schema for Postman collection items
const postmanItemSchema = z.object({
  name: z.string(),
  request: z.object({
    method: z.string(),
    header: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    url: z.union([
      z.string(),
      z.object({
        raw: z.string().optional(),
        host: z.array(z.string()).optional(),
        path: z.array(z.string()).optional(),
        query: z.array(z.object({
          key: z.string(),
          value: z.string()
        })).optional()
      })
    ]),
    body: z.object({
      mode: z.string().optional(),
      raw: z.string().optional(),
      urlencoded: z.array(z.object({
        key: z.string(),
        value: z.string()
      })).optional()
    }).optional()
  })
});

export class PostmanCollectionTool {
    
    getToolDefinitions() {
        return [
            {
                name: "import-postman-collection",
                description: "Import and parse a Postman collection file to extract API endpoints",
                inputSchema: {
                    type: "object",
                    properties: {
                        filePath: {
                            type: "string",
                            description: "Path to the Postman collection JSON file"
                        }
                    },
                    required: ["filePath"]
                }
            },
            {
                name: "list-postman-requests",
                description: "List all API requests from a previously imported Postman collection",
                inputSchema: {
                    type: "object",
                    properties: {
                        collectionName: {
                            type: "string",
                            description: "Name of the collection to list requests from"
                        }
                    }
                }
            },
            {
                name: "execute-postman-request",
                description: "Execute a specific request from the Postman collection by name",
                inputSchema: {
                    type: "object",
                    properties: {
                        requestName: {
                            type: "string",
                            description: "Name of the request to execute"
                        },
                        variables: {
                            type: "object",
                            description: "Variables to replace in the request (e.g., {{baseUrl}}, {{token}})",
                            additionalProperties: { type: "string" }
                        }
                    },
                    required: ["requestName"]
                }
            }
        ];
    }

    private collections: Map<string, any> = new Map();
    private parsedRequests: Map<string, any> = new Map();

    async handlePostmanTools(name: string, args: any) {
        switch (name) {
            case "import-postman-collection":
                return await this.importCollection(args);
            case "list-postman-requests":
                return this.listRequests(args);
            case "execute-postman-request":
                return await this.executeRequest(args);
            default:
                return null;
        }
    }

    private async importCollection(args: any) {
        try {
            const { filePath } = args;
            
            // Read the collection file
            const collectionData = await fs.readFile(filePath, 'utf-8');
            const collection = JSON.parse(collectionData);
            
            // Store the collection
            const collectionName = collection.info?.name || 'Unnamed Collection';
            this.collections.set(collectionName, collection);
            
            // Parse all requests
            const requests = this.parseRequests(collection.item || [], '');
            requests.forEach(req => {
                this.parsedRequests.set(req.name, req);
            });

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: true,
                            message: `Successfully imported collection: ${collectionName}`,
                            requestCount: requests.length,
                            requests: requests.map(r => ({ name: r.name, method: r.method, url: r.url }))
                        }, null, 2)
                    }
                ]
            };

        } catch (error: any) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: false,
                            error: `Failed to import collection: ${error.message}`
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }
    }

    private parseRequests(items: any[], prefix: string): any[] {
        const requests: any[] = [];

        for (const item of items) {
            if (item.request) {
                // This is a request item
                const name = prefix ? `${prefix} > ${item.name}` : item.name;
                const parsedRequest = this.parseRequest(item, name);
                if (parsedRequest) {
                    requests.push(parsedRequest);
                }
            } else if (item.item) {
                // This is a folder, recurse
                const folderName = prefix ? `${prefix} > ${item.name}` : item.name;
                requests.push(...this.parseRequests(item.item, folderName));
            }
        }

        return requests;
    }

    private parseRequest(item: any, name: string): any | null {
        try {
            const request = item.request;
            
            // Parse URL
            let url = '';
            if (typeof request.url === 'string') {
                url = request.url;
            } else if (request.url?.raw) {
                url = request.url.raw;
            } else if (request.url?.host && request.url?.path) {
                url = `${request.url.host.join('.')}/${request.url.path.join('/')}`;
            }

            // Parse headers
            const headers: { [key: string]: string } = {};
            if (request.header) {
                request.header.forEach((h: any) => {
                    if (h.key && h.value) {
                        headers[h.key] = h.value;
                    }
                });
            }

            // Parse query parameters
            const params: { [key: string]: string } = {};
            if (request.url?.query) {
                request.url.query.forEach((q: any) => {
                    if (q.key && q.value) {
                        params[q.key] = q.value;
                    }
                });
            }

            // Parse body
            let body = null;
            if (request.body) {
                if (request.body.raw) {
                    try {
                        body = JSON.parse(request.body.raw);
                    } catch {
                        body = request.body.raw;
                    }
                } else if (request.body.urlencoded) {
                    body = {};
                    request.body.urlencoded.forEach((item: any) => {
                        body[item.key] = item.value;
                    });
                }
            }

            return {
                name,
                method: request.method,
                url,
                headers,
                params,
                body,
                originalItem: item
            };

        } catch (error) {
            console.warn(`Failed to parse request ${name}:`, error);
            return null;
        }
    }

    private listRequests(args: any) {
        const requests = Array.from(this.parsedRequests.values());
        
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        success: true,
                        totalRequests: requests.length,
                        requests: requests.map(r => ({
                            name: r.name,
                            method: r.method,
                            url: r.url
                        }))
                    }, null, 2)
                }
            ]
        };
    }

    private async executeRequest(args: any) {
        const { requestName, variables = {} } = args;
        
        const request = this.parsedRequests.get(requestName);
        if (!request) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            success: false,
                            error: `Request '${requestName}' not found`
                        }, null, 2)
                    }
                ],
                isError: true
            };
        }

        // Replace variables in URL, headers, and body
        const processedRequest = this.replaceVariables(request, variables);

        // Execute using ApiClientTool
        const apiTool = new (await import('./ApiClientTool.js')).ApiClientTool();
        
        return await apiTool.handleApiRequest('make-api-request', {
            url: processedRequest.url,
            method: processedRequest.method,
            headers: processedRequest.headers,
            params: processedRequest.params,
            body: processedRequest.body
        });
    }

    private replaceVariables(request: any, variables: { [key: string]: string }) {
        const processed = JSON.parse(JSON.stringify(request)); // Deep clone
        const variableRegex = /\{\{([^}]+)\}\}/g;

        // Helper function to replace variables in a string
        const replaceInString = (str: string): string => {
            return str.replace(variableRegex, (match, varName) => {
                return variables[varName] || match;
            });
        };

        // Replace in URL
        if (processed.url) {
            processed.url = replaceInString(processed.url);
        }

        // Replace in headers
        Object.keys(processed.headers || {}).forEach(key => {
            processed.headers[key] = replaceInString(processed.headers[key]);
        });

        // Replace in params
        Object.keys(processed.params || {}).forEach(key => {
            processed.params[key] = replaceInString(processed.params[key]);
        });

        // Replace in body (if it's a string)
        if (typeof processed.body === 'string') {
            processed.body = replaceInString(processed.body);
        }

        return processed;
    }
}