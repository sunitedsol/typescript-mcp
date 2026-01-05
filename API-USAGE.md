# API Client Tools for Postman Integration

This project now includes tools to make API calls and import Postman collections.

## Available Tools

### 1. make-api-request
Make HTTP requests to any API endpoint with authentication support.

**Examples:**

```json
// Simple GET request
{
  "url": "https://api.example.com/users",
  "method": "GET"
}

// POST request with JSON body
{
  "url": "https://api.example.com/users",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// Request with Bearer token authentication
{
  "url": "https://api.example.com/protected",
  "method": "GET",
  "authType": "bearer",
  "token": "your-bearer-token-here"
}

// Request with API key authentication
{
  "url": "https://api.example.com/data",
  "method": "GET",
  "authType": "api-key",
  "apiKeyHeader": "X-API-Key",
  "token": "your-api-key-here"
}

// Request with query parameters
{
  "url": "https://api.example.com/search",
  "method": "GET",
  "params": {
    "q": "search term",
    "limit": "10"
  }
}
```

### 2. import-postman-collection
Import and parse a Postman collection file.

```json
{
  "filePath": "/path/to/your/postman-collection.json"
}
```

### 3. list-postman-requests
List all available requests from imported collections.

```json
{
  "collectionName": "My API Collection"
}
```

### 4. execute-postman-request
Execute a specific request from your Postman collection.

```json
{
  "requestName": "Get User Profile",
  "variables": {
    "baseUrl": "https://api.example.com",
    "userId": "123",
    "token": "your-auth-token"
  }
}
```

## Authentication Methods

### Bearer Token
```json
{
  "authType": "bearer",
  "token": "your-bearer-token"
}
```

### API Key
```json
{
  "authType": "api-key",
  "apiKeyHeader": "X-API-Key",
  "token": "your-api-key"
}
```

### Basic Authentication
```json
{
  "authType": "basic",
  "username": "your-username",
  "password": "your-password"
}
```

## How to Use with Your Postman Collection

1. **Export your Postman collection** as JSON (v2.1 format)
2. **Import the collection** using `import-postman-collection`
3. **List available requests** using `list-postman-requests`
4. **Execute specific requests** using `execute-postman-request`

## Environment Variables

You can use Postman-style variables in your collections (e.g., `{{baseUrl}}`, `{{token}}`). When executing requests, provide these variables in the `variables` parameter.

## Error Handling

All API tools provide detailed error information including:
- HTTP status codes
- Error messages
- Request/response details
- Network error information

## Examples for Common APIs

### REST API Example
```json
{
  "url": "https://jsonplaceholder.typicode.com/posts/1",
  "method": "GET"
}
```

### GraphQL API Example
```json
{
  "url": "https://api.example.com/graphql",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "query": "{ user(id: \"123\") { name email } }"
  }
}
```

### File Upload Example
```json
{
  "url": "https://api.example.com/upload",
  "method": "POST",
  "headers": {
    "Content-Type": "multipart/form-data"
  },
  "body": {
    "file": "base64-encoded-file-data"
  }
}
```