//src/server.ts

import { Server} from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// my import tools
import { ToolsCollection } from './tools/tools.js';
import {FileSystemTool} from './tools/FileSystemtool.js';
import { WeatherTool } from './tools/weathertool.js';

class MyMCPServer {
  private server: Server;
  private tools: ToolsCollection;
  private fileSystemTool: FileSystemTool;
  private weatherTool: WeatherTool;

  constructor() {
    this.server = new Server(
      {
        name: 'my-mcp-server',
        version: '1.0.5',
      },
      {
        capabilities:{
            tools:{},
            resources:{},
        }
      }
    );

    // Create an instance of ToolsCollection
    this.tools = new ToolsCollection();
    this.fileSystemTool = new FileSystemTool();
    this.weatherTool = new WeatherTool();
    
    // Register the tool handlers with the server
    //this.tools.registerTools(this.server);
    //this.fileSystemTool.registerFileTool(this.server);

    this.registerAllTools();
  }

  private registerAllTools() {
    // Register tools from ToolsCollection
    const toolDefinitions = this.tools.getToolDefinitions();
    const fileToolDefinitions = this.fileSystemTool.getToolDefinitions();
    const weatherToolDefinitions = this.weatherTool.getToolDefinitions();
    this.server.setRequestHandler(ListToolsRequestSchema, async (request) => {
      return {
        tools: [ ...toolDefinitions, 
                 ...fileToolDefinitions,
                  ...weatherToolDefinitions
                ],
      };
    });
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      // Delegate to the appropriate tool handler
      let result = await this.tools.handleCalculateTool(name, args);
      if(result) {
        return result;
      }
      result = await this.fileSystemTool.handleReadFileTool(name, args);
      if(result) {
        return result;
      }
      result = await this.weatherTool.handleGetWeatherTool(name, args);
      if(result) {
        return result;
      }

      throw new Error(`Unknown tool: ${name}`);
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('MCP Server started successfully!');
  }
}

const server = new MyMCPServer();
server.start().catch(console.error);