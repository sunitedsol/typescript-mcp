import { ApiClientTool } from '../tools/ApiClientTool';

describe('ApiClientTool', () => {
    let apiTool: ApiClientTool;

    beforeEach(() => {
        apiTool = new ApiClientTool();
    });

    test('should provide correct tool definitions', () => {
        const definitions = apiTool.getToolDefinitions();
        
        expect(definitions).toHaveLength(1);
        expect(definitions[0].name).toBe('make-api-request');
        expect(definitions[0].description).toContain('HTTP requests');
        expect(definitions[0].inputSchema.required).toContain('url');
        expect(definitions[0].inputSchema.required).toContain('method');
    });

    test('should handle unknown tool names', async () => {
        const result = await apiTool.handleApiRequest('unknown-tool', {});
        expect(result).toBeNull();
    });

    // Mock test for successful API request
    test('should handle successful GET request', async () => {
        // Note: This is a basic test structure. In practice, you'd want to mock axios
        // or use a test HTTP server to avoid making real HTTP requests in tests
        
        const mockArgs = {
            url: 'https://httpbin.org/get',
            method: 'GET'
        };

        // You can add axios mocking here if needed
        // const result = await apiTool.handleApiRequest('make-api-request', mockArgs);
        // expect(result.content[0].text).toContain('success');
    });
});