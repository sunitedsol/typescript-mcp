#!/usr/bin/env node

/**
 * Example script to demonstrate the API client tools
 * Run this with: npm run build && node dist/examples/api-example.js
 */

import { ApiClientTool } from '../tools/ApiClientTool.js';
import { PostmanCollectionTool } from '../tools/PostmanCollectionTool.js';

async function demonstrateApiTools() {
    console.log('🚀 Demonstrating API Client Tools\n');

    const apiTool = new ApiClientTool();
    const postmanTool = new PostmanCollectionTool();

    // Example 1: Simple GET request
    console.log('📡 Example 1: Simple GET request to JSONPlaceholder');
    try {
        const response = await apiTool.handleApiRequest('make-api-request', {
            url: 'https://jsonplaceholder.typicode.com/posts/1',
            method: 'GET'
        });
        
        if (response) {
            const data = JSON.parse(response.content[0].text);
            console.log('✅ Success!');
            console.log('Status:', data.status);
            console.log('Title:', data.data.title);
            console.log();
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }

    // Example 2: POST request with body
    console.log('📤 Example 2: POST request with JSON body');
    try {
        const response = await apiTool.handleApiRequest('make-api-request', {
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                title: 'My New Post',
                body: 'This is the content of my new post',
                userId: 1
            }
        });

        if (response) {
            const data = JSON.parse(response.content[0].text);
            console.log('✅ Success!');
            console.log('Status:', data.status);
            console.log('Created Post ID:', data.data.id);
            console.log();
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }

    // Example 3: Request with query parameters
    console.log('🔍 Example 3: GET request with query parameters');
    try {
        const response = await apiTool.handleApiRequest('make-api-request', {
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'GET',
            params: {
                'userId': '1',
                '_limit': '5'
            }
        });

        if (response) {
            const data = JSON.parse(response.content[0].text);
            console.log('✅ Success!');
            console.log('Status:', data.status);
            console.log('Number of posts returned:', data.data.length);
            console.log();
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }

    // Example 4: Demonstrate tool definitions
    console.log('🛠️  Available API Tools:');
    const apiDefinitions = apiTool.getToolDefinitions();
    const postmanDefinitions = postmanTool.getToolDefinitions();
    
    [...apiDefinitions, ...postmanDefinitions].forEach(tool => {
        console.log(`- ${tool.name}: ${tool.description}`);
    });
    
    console.log('\n✨ API integration demonstration complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Export your Postman collection as JSON');
    console.log('2. Use import-postman-collection to load it');
    console.log('3. Use list-postman-requests to see available endpoints');
    console.log('4. Use execute-postman-request to run specific requests');
}

// Run the demonstration
demonstrateApiTools().catch(console.error);