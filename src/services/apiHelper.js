// API Helper utilities
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const apiHelper = {
  /**
   * Generic API call handler
   * @param {string} url - API endpoint URL
   * @param {Object} options - Fetch options
   * @returns {Promise} API response
   */
  async call(url, options = {}) {
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.text();
        throw new ApiError(
          `API Error: ${response.status} ${response.statusText}`,
          response.status,
          errorData
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(`Network Error: ${error.message}`, 0, error);
    }
  },

  /**
   * Format payload for data generation
   * @param {Object} formData - Form data from component
   * @returns {Object} Formatted payload
   */
  formatGeneratePayload(formData) {
    return {
      fields: formData.fields.map((field) => ({
        name: field.name,
        dataType: field.dataType,
        randomType: field.randomType || null,
        attribute: field.attribute || null,
      })),
      generateWith: formData.generateWith,
      size: parseFloat(formData.size),
      sizeUnit: formData.sizeUnit,
      fileName: formData.fileName,
      tableName: formData.tableName,
      downloadAs: formData.downloadAs,
      fileFormat: formData.fileFormat,
      platform: formData.platform || "Windows",
    };
  },

  /**
   * Calculate requireSize based on size and unit
   * @param {string|number} size - Size value
   * @param {string} sizeUnit - Size unit (KB, MB, GB)
   * @returns {number} Size in bytes
   */
  calculateRequireSize(size, sizeUnit) {
    const sizeNum = parseFloat(size) || 0;

    switch (sizeUnit?.toLowerCase()) {
      case "kb":
        return Math.round(sizeNum * 1024);
      case "mb":
        return Math.round(sizeNum * 1024 * 1024);
      case "gb":
        return Math.round(sizeNum * 1024 * 1024 * 1024);
      default:
        return Math.round(sizeNum);
    }
  },

  /**
   * Get OS type from platform
   * @param {string} platform - Platform name (Windows/Linux)
   * @returns {string} OS type for API
   */
  getOsType(platform) {
    return platform?.toLowerCase() === "linux" ? "linux" : "windows";
  },
};
