// import { Server } from "@modelcontextprotocol/sdk/server/index.js";
// import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
// import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Define the schema for the 'calculate' tool's input
const calculateInputSchema = z.object({
  operation: z
    .enum(["add", "subtract", "multiply", "divide"])
    .describe("The arithmetic operation to perform")
    .optional(),
  // operands: z.array(z.number()).describe("The numbers to operate on"),
  operands: z.array(z.number()).describe("The numbers to operate on").optional(),
  input: z.string().describe("Natural language math expression like 'add 25 and 6' or '25 + 6'").optional(),
});

export class ToolsCollection {
  /*private server: Server;

  constructor(server: Server) {
    this.server = server;
  }*/
  // Natural language parser for mathematical expressions
  private parseNaturalLanguage(input: string): { operation: string; operands: number[] } | null {
    // Remove common words and normalize
    const normalized = input.toLowerCase().replace(/what is|calculate|compute|please|can you/g, '').trim();
    
    // Pattern matching for different operations
    const patterns = [
      { regex: /(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)/, operation: 'add' },
      { regex: /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/, operation: 'subtract' },
      { regex: /(\d+(?:\.\d+)?)\s*\*\s*(\d+(?:\.\d+)?)/, operation: 'multiply' },
      { regex: /(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/, operation: 'divide' },
      { regex: /add\s+(\d+(?:\.\d+)?)\s+(?:and\s+|to\s+|with\s+)?(\d+(?:\.\d+)?)/, operation: 'add' },
      { regex: /subtract\s+(\d+(?:\.\d+)?)\s+from\s+(\d+(?:\.\d+)?)/, operation: 'subtract' },
      { regex: /multiply\s+(\d+(?:\.\d+)?)\s+(?:by\s+|and\s+)?(\d+(?:\.\d+)?)/, operation: 'multiply' },
      { regex: /divide\s+(\d+(?:\.\d+)?)\s+by\s+(\d+(?:\.\d+)?)/, operation: 'divide' },
      { regex: /(\d+(?:\.\d+)?)\s+plus\s+(\d+(?:\.\d+)?)/, operation: 'add' },
      { regex: /(\d+(?:\.\d+)?)\s+minus\s+(\d+(?:\.\d+)?)/, operation: 'subtract' },
      { regex: /(\d+(?:\.\d+)?)\s+times\s+(\d+(?:\.\d+)?)/, operation: 'multiply' },
      { regex: /(\d+(?:\.\d+)?)\s+divided\s+by\s+(\d+(?:\.\d+)?)/, operation: 'divide' },
    ];

    for (const pattern of patterns) {
      const match = normalized.match(pattern.regex);
      if (match) {
        return {
          operation: pattern.operation,
          operands: [parseFloat(match[1]), parseFloat(match[2])]
        };
      }
    }
    
    return null;
  }
  // set definitions for this tool
  getToolDefinitions() {
    return [
      {
        name: "calculate",
        description: "Performs basic arithmetic operations",
        inputSchema: calculateInputSchema,
      },
    ];
  }

  async handleCalculateTool(name: string, args: any) {
    if (name !== "calculate") {
      return null; // Tool not handled by this class
    }

    let operation: string;
    let operands: number[];

    if (name == "calculate") {
      // const { operation, operands } = args; //replaced with the let declaration at the top
      // let result: number;
      // Check if natural language input is provided
    if (args.input && typeof args.input === 'string') {
      const parsed = this.parseNaturalLanguage(args.input);
      if (!parsed) {
        throw new Error("Could not parse mathematical expression. Try formats like '25 + 6' or 'add 25 and 6'");
      }
      operation = parsed.operation;
      operands = parsed.operands;
    } 
    // Otherwise use structured input
    else if (args.operation && args.operands) {
      operation = args.operation;
      operands = args.operands;}
    else {
      throw new Error("Invalid input: Provide either 'input' for natural language or both 'operation' and 'operands'");
    }
      let result: number; 
      switch (operation) {
        case "add": result = operands.reduce((sum: number, n: number) => sum + n, 0); break;
        case "subtract": result = operands.reduce((diff: number, n: number, i: number) => i === 0 ? n : diff - n); break;
        case "multiply": result = operands.reduce((prod: number, n: number) => prod * n, 1); break;
        case "divide": result = operands.reduce((quot: number, n: number, i: number) => i === 0 ? n : quot / n); break;
        default: throw new Error("Invalid operation");
      }
      return {
        content: [
          {
            type: "text",
            text: `The result of ${operation} on [${operands.join(", ")}] is ${result}`,
          },
        ],
      };
    }
    throw new Error("Tool not found");
  
  }

}