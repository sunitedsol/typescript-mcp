import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";


export class FileSystemTool {
    /*private server: Server;
    constructor(server: Server) {
        this.server = server;
    }*/
    getToolDefinitions() {
        return [
            {
                name: "read-file",
                description: "Performs basic file system operations by reading content of a text file",
                inputSchema: {
                    type: "object",
                    properties: {
                        filePath: {
                            type: "string",
                            description: "The path to the text file to read"
                        }
                    },
                    required: ["filePath"]
                }
            },
        ];
    }
    async handleReadFileTool(name: string, args: any) {
        if (name !== "read-file") {
            return null; // Tool not handled by this class
        }
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
        return null;
        // return "no file or another type of error"; // Tool not handled by this class
    }

} // end the FileSystemTool class