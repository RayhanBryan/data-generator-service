// API Base Configuration
const API_BASE_URL = "https://40.90.208.92:2973";

// API Service Class
class DummyGeneratorService {
  /**
   * Generate dummy data file
   * @param {Object} payload - Data generation parameters
   * @param {number} requireSize - Required size parameter
   * @param {string} osType - OS type (windows/linux)
   * @returns {Promise} API response
   */
  async generateDataFile(payload, requireSize = 0, osType = "windows") {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        requireSize: requireSize.toString(),
        osType: osType.toLowerCase(),
      });

      const response = await fetch(`${API_BASE_URL}/dummy/data/file/generator?${queryParams}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Check if response is a downloadable file
      const contentType = response.headers.get("content-type");
      const contentDisposition = response.headers.get("content-disposition");

      if (contentDisposition && contentDisposition.includes("attachment")) {
        // This is a file download
        const blob = await response.blob();

        // Extract filename from Content-Disposition header or use default
        let filename = "generated_data.txt";
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, "");
          }
        }

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        return {
          success: true,
          message: `File ${filename} downloaded successfully`,
          filename: filename,
          size: blob.size,
        };
      } else if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        // Return text if not JSON or file
        const textResponse = await response.text();
        console.log("Non-JSON response:", textResponse);
        return { message: textResponse, success: true };
      }
    } catch (error) {
      console.error("Error generating data file:", error);
      throw error;
    }
  }

  /**
   * Get list of available table data types
   * @returns {Promise<Array>} List of table data types
   */
  async getTableDataTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/dummy/data/list-table-data-type`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        const textResponse = await response.text();
        console.log("Non-JSON response:", textResponse);
        return [];
      }
    } catch (error) {
      console.error("Error fetching table data types:", error);
      throw error;
    }
  }

  /**
   * Get list of available random data types
   * @returns {Promise<Array>} List of random data types
   */
  async getRandomDataTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/dummy/data/list-random-data-type`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        const textResponse = await response.text();
        console.log("Non-JSON response:", textResponse);
        return [];
      }
    } catch (error) {
      console.error("Error fetching random data types:", error);
      throw error;
    }
  }
}

// Export single instance
export default new DummyGeneratorService();
