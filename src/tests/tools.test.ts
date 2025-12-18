import { ToolsCollection } from '../tools/tools';

describe('ToolsCollection', () => {
  let toolsCollection: ToolsCollection;

  beforeEach(() => {
    toolsCollection = new ToolsCollection();
  });

  describe('calculate tool', () => {
    it('should add numbers correctly', async () => {
      const result = await toolsCollection.handleCalculateTool('calculate', {
        operation: 'add',
        operands: [5, 3, 2]
      });

      console.log('Add test result:', result);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'The result of add on [5, 3, 2] is 10'
          }
        ]
      });
    });

    it('should subtract numbers correctly', async () => {
      const result = await toolsCollection.handleCalculateTool('calculate', {
        operation: 'subtract',
        operands: [10, 3, 2]
      });

      console.log('Subtract test result:', result);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'The result of subtract on [10, 3, 2] is 5'
          }
        ]
      });
    });

    it('should multiply numbers correctly', async () => {
      const result = await toolsCollection.handleCalculateTool('calculate', {
        operation: 'multiply',
        operands: [2, 3, 4]
      });

      console.log('Multiply test result:', result);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'The result of multiply on [2, 3, 4] is 24'
          }
        ]
      });
    });

    it('should divide numbers correctly', async () => {
      const result = await toolsCollection.handleCalculateTool('calculate', {
        operation: 'divide',
        operands: [100, 2, 5]
      });

      console.log('Divide test result:', result);
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: 'The result of divide on [100, 2, 5] is 10'
          }
        ]
      });
    });

    it('should return null for non-calculate tools', async () => {
      const result = await toolsCollection.handleCalculateTool('other-tool', {
        operation: 'add',
        operands: [1, 2]
      });

      console.log('Non-calculate tool result:', result);
      expect(result).toBeNull();
    });

    it('should throw error for invalid operation', async () => {
      await expect(
        toolsCollection.handleCalculateTool('calculate', {
          operation: 'invalid',
          operands: [1, 2]
        })
      ).rejects.toThrow('Invalid operation');
    });
  });

  describe('getToolDefinitions', () => {
    it('should return calculate tool definition', () => {
      const definitions = toolsCollection.getToolDefinitions();

      // console.log('Tool definitions:', definitions);
      expect(definitions).toHaveLength(1);
      expect(definitions[0].name).toBe('calculate');
      expect(definitions[0].description).toBe('Performs basic arithmetic operations');
    });
  });
});
