import { useEffect } from "react";

export function LiveActivity() {
  useEffect(() => {
    const scriptId = "jotform-ai-ticket-script";
    
    // Check if script already exists to prevent duplicates
    if (document.getElementById(scriptId)) return;

    // Create the script element
    const script = document.createElement("script");
    script.id = scriptId;
    // Using the exact URL provided by the user
    script.src = "https://cdn.jotfor.ms/agent/embedjs/019d21cff67372568f091cb45e17a4a2cc6d/embed.js";
    script.async = true;
    
    // "Script error." is often a CORS issue. 
    // However, if the server doesn't support CORS, this might block the script.
    // We'll try without crossOrigin first but with better error handling.
    // If the user still sees it, we might need to suppress global errors.
    
    script.onerror = (e) => {
      console.warn("JotForm script failed to load. This might be due to ad-blockers or network issues.", e);
    };

    // Append the script to the body
    document.body.appendChild(script);

    // Cleanup function to remove the script when component unmounts
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      
      // Cleanup JotForm specific elements if they exist
      const jotformAgent = document.querySelector('.jotform-agent-embed');
      if (jotformAgent) {
        jotformAgent.remove();
      }
      
      // Remove any other JotForm related elements that might have been injected
      const jotformElements = document.querySelectorAll('[id^="jotform"]');
      jotformElements.forEach(el => el.remove());
    };
  }, []);

  return null;
}
