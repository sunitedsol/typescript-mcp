## Intro:
- Applied some of the learnings from https://serveravatar.com/create-mcp-server-nodejs/

- Instead of putting all in once place I placed the tools into separate files (the tools folder) as definitions.They are pulled into the server.js, which is the main file.

- Do not have API keys in your code, but in environments. In this case you will see the package.json has a dependency of the dotenv. Which then gets called in the server.js file (code: dotenv.config()), which then can be used within the tools (see how in the weather tools the API key is pulled into it).

# Features:
- ✅ Calculator Tool - Perform arithmetic operations
- ✅ File System Tool - Read files from the workspace
- ✅ Weather Tool - Get weather information using WeatherAPI.com
- ? API Client Tool - Make HTTP requests to any API endpoint with authentication support
- ? Postman Collection Tool - Import and execute Postman collections

## Recent Updates:
### API Integration
- Added comprehensive API client tool supporting GET, POST, PUT, DELETE, PATCH requests
- Support for multiple authentication methods (Bearer token, API key, Basic auth)
- Postman collection import and execution capabilities
- Variable substitution for Postman collections (e.g., {{baseUrl}}, {{token}})
- Detailed error handling and response formatting

## Quick Start with API Tools:
1. **Make a simple API request:**
   ```json
   {
     "url": "https://jsonplaceholder.typicode.com/posts/1",
     "method": "GET"
   }
   ```

2. **Import a Postman collection:**
   ```json
   {
     "filePath": "/path/to/your/collection.json"
   }
   ```

3. **Execute a request from your collection:**
   ```json
   {
     "requestName": "Get All Users",
     "variables": {
       "baseUrl": "https://api.example.com",
       "token": "your-auth-token"
     }
   }
   ```

See [API-USAGE.md](API-USAGE.md) for detailed examples and documentation.
