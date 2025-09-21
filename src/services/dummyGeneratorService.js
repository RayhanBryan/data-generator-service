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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching random data types:", error);
      throw error;
    }
  }
}

// Export single instance
export default new DummyGeneratorService();
