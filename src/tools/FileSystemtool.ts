import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";


export class FileSystemTool {
    private server: Server;
    constructor(server: Server) {
        this.server = server;
    }
    // This method registers the tool handlers
    public registerFileTool(server: Server) {
        this.server.setRequestHandler(ListToolsRequestSchema, async (request) => {
            // This handler must return an object with a 'tools' property
            return {
                tools: [
                    {
                        name: "read-file",
                        description: "Performs basic file system operations by reading content of a text file",
                        // Define input schema as needed
                        inputSchema: z.object({
                            filePath: z.string().describe("The path to the text file to read"),
                        }),
                        required:["filePath"]
                    },
                ],
            };
        });

        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            if (name === 'read-file') {
                const { filePath } = args as any;
                const fs = await import('fs/promises');
                try {
                    const content = await fs.readFile(filePath, 'utf-8');
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Content of file ${filePath}:\n${content}`
                            }
                        ]
                    };
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Error reading file ${filePath}: ${errorMessage}`
                            }
                        ],
                        isError: true
                    };
                }
            }
            //Handle unknown tool requests
            throw new Error(`Unknown tool: ${name}`);
        });
    } // end the registerFileTool method
} // end the FileSystemTool class