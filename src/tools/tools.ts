import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import {FileSystemTool} from './FileSystemtool.js';

// Define the schema for the 'calculate' tool's input
const calculateInputSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The arithmetic operation to perform"),
  operands: z.array(z.number()).describe("The numbers to operate on"),
});

export class ToolsCollection {
  private server: Server;

  constructor(server: Server) {
    this.server = server;
  }

  // This method registers the tool handlers
  public registerTools(server: Server) {
    this.server.setRequestHandler(ListToolsRequestSchema, async (request) => {
      // This handler must return an object with a 'tools' property
      return {
        tools: [
          {
            name: "calculate",
            description: "Performs basic arithmetic operations",
            inputSchema: calculateInputSchema,
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
  
        if (name === 'calculate') {
            const { operation, operands } = args as any;
            let result: number;
            
            switch (operation) {
            case 'add': result = operands.reduce((sum: number, n: number) => sum + n, 0); break;
            case 'subtract': result = operands.reduce((diff: number, n: number, i: number) => i === 0 ? n : diff - n); break;
            case 'multiply': result = operands.reduce((prod: number, n: number) => prod * n, 1); break;
            case 'divide': result = operands.reduce((quot: number, n: number, i: number) => i === 0 ? n : quot / n); break;
            default: throw new Error('Invalid operation');
            }
    
        return {
        content: [
            {
            type: 'text',
            text: `The result of ${operation} on [${operands.join(', ')}] is ${result}`
            }
        ]
        };
        }
  
    throw new Error('Tool not found');
    });

    // You would register the handler for the 'calculate' tool itself here
    // For example:
    // this.server.registerTool("calculate", { ... }, async (input) => { ... });
  }
}