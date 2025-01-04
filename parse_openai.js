import fs from 'fs/promises';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configuration
const API_KEY = process.env.OPENAI_API_KEY; // Take API_KEY from environment variable
const SCRIPT_FILE_PATH = process.env.SCRIPT_FILE_PATH; // Local file path

if (!API_KEY) {
    throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}

const openai = new OpenAI({
    apiKey: API_KEY
});

/**
 * Fetch document content from a local file.
 * @param {string} filePath - Path to the local file.
 * @returns {Promise<string>} - The document content as a string.
 */
async function fetchDocumentContent(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return data; // Assumes document content is plain text or Markdown.
    } catch (error) {
        console.error("Error fetching document:", error.message);
        throw error;
    }
}

const JSON_FORMAT = fetchDocumentContent("src/assets/format.schema.json");

/**
 * Transform script content into the JSON format using OpenAI API.
 * @param {string} scriptText - The raw script text.
 * @returns {Promise<Object>} - The transformed JSON object.
 */
async function transformScriptToJSON(scriptText) {
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            stream: true,
            messages: [
                {
                    role: "system",
                    content: `You are a theater plays script processor. Transform scripts into structured JSON of the following format:\n\n${JSON_FORMAT}`
                },
                {
                    role: "user",
                    content: `Transform the following script into JSON format as described:\n\n${scriptText}`
                }
            ],
            max_tokens: 10000
        });
        var out = "";
        for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || "";
            out+=delta;
            process.stdout.write(delta);
        }
        //return JSON.parse(response.data.choices[0].message.content);
        return out;
    } catch (error) {
        console.error("Error transforming script:", error.message);
        throw error;
    }
}

/**
 * Main function to fetch and transform the script.
 * @param {string} filePath - Path to the local file containing the script.
 */
async function main(filePath) {
    try {
        console.log("Fetching document content...");
        const scriptText = await fetchDocumentContent(filePath);

        console.log("Transforming script to JSON...");
        const jsonOutput = await transformScriptToJSON(scriptText);

        console.log("Transformation complete. Output:");
        console.log(JSON.stringify(jsonOutput, null, 2));
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

main(SCRIPT_FILE_PATH);