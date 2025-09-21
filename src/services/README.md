# API Service Documentation

## Overview

API service untuk Data Generator yang terhubung ke backend di `https://40.90.208.92:2973`

## Files Structure

```
src/services/
├── dummyGeneratorService.js    # Main API service
└── apiHelper.js                # Helper utilities
```

## Available Endpoints

### 1. Generate Data File

**POST** `/dummy/data/file/generator?requireSize=1048576&osType=windows`

**Payload:**

```javascript
{
  "goOS": "windows",
  "tableName": "string",
  "totalRows": 0,
  "fileName": "string",
  "fileTypeDestination": "string",
  "listColumnDetails": [
    {
      "columnName": "string",
      "columnDataType": "string",
      "randomType": "string",
      "rangeFormatValue": "string"
    }
  ]
}
```

**Example:**

```javascript
{
  "goOS": "windows",
  "tableName": "test_table",
  "totalRows": 0,
  "fileName": "test-data",
  "fileTypeDestination": "csv",
  "listColumnDetails": [
    {
      "columnName": "id",
      "columnDataType": "Int",
      "randomType": "Random Number",
      "rangeFormatValue": "1-1000"
    },
    {
      "columnName": "name",
      "columnDataType": "Varchar",
      "randomType": "Name",
      "rangeFormatValue": ""
    }
  ]
}
```

### 2. Get Table Data Types

**GET** `/dummy/data/list-table-data-type`

Returns array of available table data types.

### 3. Get Random Data Types

**GET** `/dummy/data/list-random-data-type`

Returns array of available random data types.

## Usage in Component

```javascript
import dummyGeneratorService from "../services/dummyGeneratorService.js";
import { apiHelper } from "../services/apiHelper.js";

// Load data types
const tableTypes = await dummyGeneratorService.getTableDataTypes();
const randomTypes = await dummyGeneratorService.getRandomDataTypes();

// Generate data
const payload = apiHelper.formatGeneratePayload(formData);
const result = await dummyGeneratorService.generateDataFile(payload);
```

## Error Handling

All API calls include comprehensive error handling:

- Network errors
- HTTP status errors
- JSON parsing errors
- Custom ApiError class

## Notes

- API uses HTTPS
- All endpoints return JSON
- CORS must be configured on backend
- Error messages are user-friendly
