// Test API Connection
import dummyGeneratorService from "./dummyGeneratorService.js";

/**
 * Test all API endpoints
 */
export const testApiConnection = async () => {
  console.log("Testing API connection...");

  try {
    // Test 1: Get Table Data Types
    console.log("1. Testing GET /dummy/data/list-table-data-type");
    const tableTypes = await dummyGeneratorService.getTableDataTypes();
    console.log("✅ Table Data Types:", tableTypes);

    // Test 2: Get Random Data Types
    console.log("2. Testing GET /dummy/data/list-random-data-type");
    const randomTypes = await dummyGeneratorService.getRandomDataTypes();
    console.log("✅ Random Data Types:", randomTypes);

    // Test 3: Generate Data File (sample payload)
    console.log("3. Testing POST /dummy/data/file/generator");
    const samplePayload = {
      fields: [
        {
          name: "id",
          dataType: "Int",
          randomType: "Random Number",
          attribute: "1-1000",
        },
        {
          name: "name",
          dataType: "Varchar",
          randomType: "Name",
          attribute: null,
        },
      ],
      generateWith: "Size",
      size: 1.0,
      sizeUnit: "MB",
      fileName: "test-data",
      tableName: "test_table",
      downloadAs: "Script",
      fileFormat: "CSV",
      platform: "Windows",
    };

    const result = await dummyGeneratorService.generateDataFile(samplePayload);
    console.log("✅ Generate Data Result:", result);

    console.log("🎉 All API tests passed!");
    return true;
  } catch (error) {
    console.error("❌ API Test Failed:", error);
    return false;
  }
};

// Auto-run test when imported (for development)
if (process.env.NODE_ENV === "development") {
  // Uncomment to auto-test on import
  // testApiConnection();
}
