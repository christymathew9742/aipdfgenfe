export const AZURE_KEY = ''; 
export const AZURE_REGION = '';

// Ensure variables are loaded
if (!AZURE_KEY || !AZURE_REGION) {
  console.error("Missing Azure Speech Service environment variables.");
  throw new Error("Azure Speech Service credentials are not set!");
}
