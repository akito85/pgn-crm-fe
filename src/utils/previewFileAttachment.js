export const previewFileAttachment = (base64) => {
  if (base64) {
    // Create a new window or tab with the Base64 content
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.open();
      const generatePreviewContent = (base64String) => {
        if (base64String.startsWith("data:image/")) {
          return `<img src="${base64String}" alt="Image Preview" />`;
        }
        if (base64String.startsWith("data:application/pdf")) {
          return `<embed src="${base64String}" type="application/pdf" width="100%" height="1000" />`;
        }
        if (base64String.startsWith("data:video/")) {
          return `
              <video controls width="100%" height="auto">
                <source src="${base64String}" type="video/mp4" />
              </video>
            `;
        }
        return "<p>Unsupported file format</p>";
      };
      newWindow.document.write(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>File Preview</title>
            </head>
            <body style="margin: 0; padding: 0;">
              <!-- Display the Base64 content based on its type -->
              ${generatePreviewContent(base64)}
            </body>
          </html>
        `);
      newWindow.document.close();
    } else {
      // Handle popup blocker or inability to open new window
      console.error(
        "Unable to open preview window. Please check your popup blocker settings.",
      );
    }
  } else {
    console.error("Base64 content is missing.");
  }
};
