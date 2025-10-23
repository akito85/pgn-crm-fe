export const PreviewFile = (base64, fileName) => {
  if (base64) {
    if (base64.startsWith("data:application/msword")) {
      const name = `${fileName}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = base64;
      downloadLink.download = name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      //If required to open new tab and download the file
      //   return `<iframe src="${base64String}" type="application/msword" width="100%" height="1000" /></iframe>`;
    } else {
      const newWindow = window.open("", "_blank", "fullscreen=yes");
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
      // Create a new window or tab with the Base64 content
      newWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>File Preview</title>
              </head>
              <body>
                <!-- Display the Base64 content based on its type -->
                ${generatePreviewContent(base64)}
              </body>
            </html>
          `);
      newWindow.document.close();
    }
  }
};
