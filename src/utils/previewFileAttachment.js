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
          // Convert base64 to blob URL for better handling of large PDFs
          try {
            const byteCharacters = atob(base64String.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            // Return iframe with blob URL and cleanup script
            return `
              <iframe src="${blobUrl}" type="application/pdf" width="100%" height="100%" style="border: none;">
                <p>Your browser does not support PDFs. <a href="${blobUrl}">Download the PDF</a>.</p>
              </iframe>
              <script>
                // Cleanup blob URL when window is closed
                window.addEventListener('beforeunload', function() {
                  URL.revokeObjectURL('${blobUrl}');
                });
              </script>
            `;
          } catch (error) {
            console.error('Error converting PDF base64 to blob:', error);
            return '<p>Error loading PDF preview</p>';
          }
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
              <style>
                body, html {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  overflow: hidden;
                }
              </style>
            </head>
            <body>
              <!-- Display the Base64 content based on its type -->
              ${generatePreviewContent(base64)}
            </body>
          </html>
        `);
      newWindow.document.close();
    } else {
      // Handle popup blocker or inability to open new window
      console.error("Unable to open preview window. Please check your popup blocker settings.");
    }
  } else {
    console.error("Base64 content is missing.");
  }
};
