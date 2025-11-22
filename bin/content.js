// 1. The Observer: Azure is a Single Page App, so we watch for changes to the DOM
const observer = new MutationObserver((mutations) => {
    checkForRuleQuery();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

function checkForRuleQuery() {
    // 2. The Selector: Find the label with the stable test-id
    const labels = document.querySelectorAll('[data-testid="DetailsPanelBodyItemTitle"]');

    labels.forEach(label => {
        // Ensure we only target the "Rule query" section
        if (label.innerText.trim() === "Rule query") {
            
            // Find the container immediately following the label
            const siblingDiv = label.nextElementSibling;
            if (!siblingDiv) return;

            // Look for the code viewer specifically
            const codeContainer = siblingDiv.querySelector('.uc-kql-viewer');
            
            if (codeContainer) {
                // Check if we already injected the button to avoid duplicates
                if (codeContainer.querySelector('.sentinel-smart-copy-btn')) return;
                
                injectButton(codeContainer);
            }
        }
    });
}

function injectButton(container) {
    // 3. Create the Button
    const btn = document.createElement("button");
    btn.innerText = "Copy KQL";
    btn.className = "sentinel-smart-copy-btn";
    
    // 4. Styling to make it float top-right over the code
    Object.assign(btn.style, {
        position: "absolute",
        top: "5px",
        right: "20px", // Adjusted for scrollbar
        zIndex: "9999",
        backgroundColor: "#0078d4", // Azure Blue
        color: "white",
        border: "none",
        padding: "6px 12px",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
    });

    // Ensure container is relative so absolute positioning works
    container.style.position = "relative";
    container.appendChild(btn);

    // 5. The Copy Logic
    btn.addEventListener("click", () => {
        const preTag = container.querySelector("pre");
        
        if (preTag) {
            // innerText preserves newlines from the <pre> tag automatically
            const rawText = preTag.innerText;
            
            navigator.clipboard.writeText(rawText).then(() => {
                // Visual Feedback
                const originalText = btn.innerText;
                btn.innerText = "Copied! ✓";
                btn.style.backgroundColor = "#107c10"; // Success Green
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = "#0078d4"; // Back to Blue
                }, 2000);
            });
        }
    });
}
