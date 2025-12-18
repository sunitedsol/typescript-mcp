// a getdefinition to integrate the weatherapi.com API
import { z } from "zod";

export class WeatherTool {
    /*private server: Server;
    constructor(server: Server) {
        this.server = server;
    }*/
    getToolDefinitions() {
        return [
            {
                name: "get-weather",
                description: "Fetches current weather information for a specified city using the WeatherAPI.com service",
                inputSchema: {
                    type: "object",
                    properties: {
                        city: {
                            type: "string",
                            description: "The name of the city to get the weather for"
                        }  
                    },
                    required: ["city"]
                }
            }
        ];
    }
    async handleGetWeatherTool(name: string, args: any) {
        if (name !== "get-weather") {
            return null; // Tool not handled by this class
        }
        if (name === 'get-weather') {
            const { city } = args as any;
            // const apiKey = 'KEY'; // Replace with your actual WeatherAPI key
            const apiKey = process.env.WEATHERAPI_KEY;
            const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}`;
            try {
                const response = await fetch(apiUrl); 
                if (!response.ok) {
                    throw new Error(`Error fetching weather data: ${response.statusText}`);
                }
                const data = await response.json();
                const weatherInfo = `Current weather in ${data.location.name}, ${data.location.country}:
                    - Temperature: ${data.current.temp_c}°C
                    - Condition: ${data.current.condition.text}
                    - Humidity: ${data.current.humidity}%
                    - Wind: ${data.current.wind_kph} kph`;
                return {
                    content: [
                        {
                            type: 'text',
                            text: weatherInfo
                        }
                    ]
                };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error fetching weather data for ${city}: ${errorMessage}`
                        }
                    ],
                    isError: true
                };
            }
        }
        return null; // Tool not handled by this class
    }
} // end the WeatherTool class