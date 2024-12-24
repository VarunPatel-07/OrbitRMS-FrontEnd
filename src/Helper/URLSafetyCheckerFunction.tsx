import axios from "axios";

const Google_API_Key = import.meta.env.VITE_GOOGLE_SAFE_BROWSING_CHECKER_API_KEY;

export const URLSafetyCheckerFunction = async (url: string) => {
  if (url.length == 0)
    return {
      urlStatus: "",
      isError: false,
      isEmptyString: true,
    };
  // Regular expression to validate URL format
  const urlRegex = /^(https?:\/\/)([^\s/?#]+)([^\s]*)$/;

  if (!urlRegex.test(url) || url.split("https://").length > 2) {
    console.log("⚠️ Invalid URL format.");
    return {
      urlStatus: "invalid",
      isError: false,
      isEmptyString: false,
    };
  }

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
      console.log("❌ The URL is unsafe!");
      return {
        urlStatus: "unsafe",
        isError: false,
        isEmptyString: false,
      };
    } else {
      console.log("✅ The URL is safe!");
      return {
        urlStatus: "safe",
        isError: false,
        isEmptyString: false,
      };
    }
  } catch (error) {
    console.log("⚠️ Error checking URL safety.");
    console.error(error);
    return {
      urlStatus: "error",
      isError: true,
      isEmptyString: false,
    };
  }
};
