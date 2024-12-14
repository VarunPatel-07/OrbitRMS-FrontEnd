import axios from "axios";

const Google_API_Key = import.meta.env.VITE_GOOGLE_SAFE_BROWSING_CHECKER_API_KEY;

export const URLSafetyCheckerFunction = (url: string) => {
  console.log(url);
  const CheckURLSafety = async () => {
    const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${Google_API_Key}`;
    const requestBody = {
      client: {
        clientId: "your-client-id",
        clientVersion: "1.0.0",
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }],
      },
    };
    try {
      const response = await axios.post(endpoint, requestBody);
      if (response.data && response.data.matches) {
        // setResult("❌ The URL is unsafe!");
        console.log("❌ The URL is unsafe!");
      } else {
        // setResult("✅ The URL is safe!");
        console.log("✅ The URL is safe!");
      }
    } catch (error) {
      // setResult("⚠️ Error checking URL safety.");
      console.log("⚠️ Error checking URL safety.");

      console.error(error);
    }
  };
  CheckURLSafety();
};
