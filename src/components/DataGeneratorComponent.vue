<template>
  <div>
    <AppHeader />

    <div class="white-page">
      <v-container fluid class="px-4 py-4">
        <!-- Title Section -->
        <v-row class="mb-6 d-flex justify-space-between">
          <v-col cols="6">
            <h1 class="text-h4 font-weight-bold text-primary">Data Generator</h1>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="6" class="text-right">
            <v-btn
              color="primary"
              prepend-icon="mdi-refresh"
              @click="resetTable"
              :disabled="loading"
            >
              Reset Table
            </v-btn>
          </v-col>
        </v-row>

        <!-- Error Alert -->
        <v-alert
          v-if="apiError"
          type="error"
          variant="tonal"
          closable
          @click:close="apiError = null"
          class="mb-4"
        >
          {{ apiError }}
        </v-alert>

        <!-- Loading Indicator -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="mb-4"
        ></v-progress-linear>

        <!-- Table Card Container -->
        <v-card elevation="2" class="pa-4 mb-6">
          <!-- Header Row -->
          <v-row class="mb-4">
            <v-col cols="2" class="text-h6 font-weight-medium">Field Name</v-col>
            <v-col cols="2" class="text-h6 font-weight-medium">Data Type in Table</v-col>
            <v-col cols="2" class="text-h6 font-weight-medium">Random Data Type</v-col>
            <v-col cols="4" class="text-h6 font-weight-medium">Attribute</v-col>
            <v-col cols="2"></v-col>
          </v-row>

          <!-- Dynamic Fields -->
          <div v-for="(field, index) in fields" :key="field.id" class="mb-3">
            <v-row align="center">
              <v-col cols="2">
                <v-text-field
                  v-model="field.name"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="field.dataType"
                  :items="dataTypes"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="field.randomType"
                  :items="randomTypes"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  placeholder="Pilih opsi"
                ></v-select>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  v-model="field.attribute"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  placeholder="Edit Attribute"
                ></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  variant="tonal"
                  @click="removeField(index)"
                ></v-btn>
              </v-col>
            </v-row>
          </div>

          <!-- Add Field Button -->
          <v-btn color="primary" prepend-icon="mdi-plus" @click="addField" class="mt-4">
            Add Another Field
          </v-btn>
        </v-card>

        <!-- Generation Options Card -->
        <v-card elevation="2" class="pa-4 mb-6">
          <v-row class="mt-2">
            <v-col cols="6">
              <v-select
                v-model="generateWith"
                label="Generate With:"
                :items="generateOptions"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-row>
                <v-col cols="8" class="pa-0 pe-1">
                  <v-text-field
                    v-model="size"
                    label="Size:"
                    variant="outlined"
                    density="comfortable"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="4" class="pa-0">
                  <v-select
                    v-model="sizeUnit"
                    label="Unit:"
                    :items="sizeUnits"
                    variant="outlined"
                    density="comfortable"
                  ></v-select>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <!-- File and Table Names -->
          <v-row class="mt-4">
            <v-col cols="6">
              <v-text-field
                v-model="fileName"
                label="File Name:"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="tableName"
                label="Table Name:"
                variant="outlined"
                density="comfortable"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Download Options -->
          <v-row class="mt-4">
            <v-col cols="6">
              <v-select
                v-model="downloadAs"
                label="Download As:"
                :items="downloadOptions"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="fileFormat"
                label="File Format:"
                :items="fileFormats"
                variant="outlined"
                density="comfortable"
              ></v-select>
            </v-col>
          </v-row>
        </v-card>

        <!-- Generate Buttons -->
        <v-row class="mt-8 justify-center">
          <v-col cols="auto">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-microsoft-windows"
              @click="generateDataWindows"
              class="px-8 mr-4"
              :loading="loading"
              :disabled="loading"
            >
              Generate Data for Windows
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="orange"
              size="large"
              prepend-icon="mdi-linux"
              @click="generateDataLinux"
              class="px-8"
              :loading="loading"
              :disabled="loading"
            >
              Generate Data for Linux
            </v-btn>
          </v-col>
        </v-row>

        <!-- Footer -->
        <AppFooter />
      </v-container>
    </div>
  </div>
</template>

<script>
import AppHeader from "./AppHeader.vue";
import AppFooter from "./AppFooter.vue";
import dummyGeneratorService from "../services/dummyGeneratorService.js";
import { apiHelper } from "../services/apiHelper.js";

export default {
  name: "DataGeneratorComponent",
  components: {
    AppHeader,
    AppFooter,
  },
  data() {
    return {
      fields: [
        {
          id: 1,
          name: "id",
          dataType: "Varchar",
          randomType: "",
          attribute: "",
        },
        {
          id: 2,
          name: "name",
          dataType: "Varchar",
          randomType: "",
          attribute: "",
        },
        {
          id: 3,
          name: "amount",
          dataType: "Int",
          randomType: "",
          attribute: "10-100",
        },
      ],
      dataTypes: [
        "Varchar",
        "Int",
        "BigInt",
        "Float",
        "Double",
        "Boolean",
        "Date",
        "DateTime",
        "Text",
      ],
      randomTypes: [
        "Name",
        "Email",
        "Phone",
        "Address",
        "Random Number",
        "Random Text",
        "UUID",
        "Date Range",
        "Boolean",
      ],
      generateWith: "Size",
      generateOptions: ["Size", "Count", "Custom"],
      size: "500.00",
      sizeUnit: "MB",
      sizeUnits: ["KB", "MB", "GB"],
      fileName: "dummy-generator",
      tableName: "dummy_table",
      downloadAs: "Script",
      downloadOptions: [
        { title: "Script", value: "Script" },
        { title: "File", value: "File", props: { disabled: true } },
      ],
      fileFormat: "CSV",
      fileFormats: ["CSV", "SQL"],
      nextId: 4,
      loading: false,
      apiError: null,
    };
  },
  async mounted() {
    // Load data types from API when component mounts
    await this.loadDataTypes();
  },
  methods: {
    async loadDataTypes() {
      try {
        this.loading = true;
        this.apiError = null;

        // Load table data types
        const tableTypes = await dummyGeneratorService.getTableDataTypes();
        if (Array.isArray(tableTypes)) {
          this.dataTypes = tableTypes;
        }

        // Load random data types
        const randomTypes = await dummyGeneratorService.getRandomDataTypes();
        if (Array.isArray(randomTypes)) {
          this.randomTypes = randomTypes;
        }
      } catch (error) {
        console.error("Error loading data types:", error);
        this.apiError = "Failed to load data types from server";
        // Keep default values if API fails
      } finally {
        this.loading = false;
      }
    },
    addField() {
      this.fields.push({
        id: this.nextId++,
        name: "",
        dataType: "Varchar",
        randomType: "",
        attribute: "",
      });
    },
    removeField(index) {
      if (this.fields.length > 1) {
        this.fields.splice(index, 1);
      }
    },
    resetTable() {
      this.fields = [
        {
          id: 1,
          name: "id",
          dataType: "Varchar",
          randomType: "",
          attribute: "",
        },
        {
          id: 2,
          name: "name",
          dataType: "Varchar",
          randomType: "",
          attribute: "",
        },
        {
          id: 3,
          name: "amount",
          dataType: "Int",
          randomType: "",
          attribute: "10-100",
        },
      ];
      this.nextId = 4;
      this.fileName = "dummy-generator";
      this.tableName = "dummy_table";
      this.downloadAs = "Script";
      this.fileFormat = "CSV";
      this.size = "500.00";
      this.generateWith = "Size";
      this.sizeUnit = "MB";
    },
    generateData() {
      // Legacy method - redirect to Windows
      this.generateDataWindows();
    },
    async generateDataWindows() {
      try {
        this.loading = true;
        this.apiError = null;

        const payload = apiHelper.formatGeneratePayload({
          fields: this.fields,
          generateWith: this.generateWith,
          size: this.size,
          sizeUnit: this.sizeUnit,
          fileName: this.fileName,
          tableName: this.tableName,
          downloadAs: this.downloadAs,
          fileFormat: this.fileFormat,
          platform: "Windows",
        });

        const result = await dummyGeneratorService.generateDataFile(payload);

        // Show success message
        this.$nextTick(() => {
          alert(
            `Windows Data generation successful!\nFields: ${this.fields.length}\nFile: ${this.fileName}\nTable: ${this.tableName}\nFormat: ${this.fileFormat}`
          );
        });

        console.log("Generation result:", result);
      } catch (error) {
        console.error("Error generating Windows data:", error);
        this.apiError = `Failed to generate data: ${error.message}`;

        this.$nextTick(() => {
          alert(`Error generating data: ${error.message}`);
        });
      } finally {
        this.loading = false;
      }
    },
    async generateDataLinux() {
      try {
        this.loading = true;
        this.apiError = null;

        const payload = apiHelper.formatGeneratePayload({
          fields: this.fields,
          generateWith: this.generateWith,
          size: this.size,
          sizeUnit: this.sizeUnit,
          fileName: this.fileName,
          tableName: this.tableName,
          downloadAs: this.downloadAs,
          fileFormat: this.fileFormat,
          platform: "Linux",
        });

        const result = await dummyGeneratorService.generateDataFile(payload);

        // Show success message
        this.$nextTick(() => {
          alert(
            `Linux Data generation successful!\nFields: ${this.fields.length}\nFile: ${this.fileName}\nTable: ${this.tableName}\nFormat: ${this.fileFormat}`
          );
        });

        console.log("Generation result:", result);
      } catch (error) {
        console.error("Error generating Linux data:", error);
        this.apiError = `Failed to generate data: ${error.message}`;

        this.$nextTick(() => {
          alert(`Error generating data: ${error.message}`);
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.white-page {
  background-color: #ffffff !important;
  min-height: calc(100vh - 64px);
  width: calc(100vw - 17px) !important; /* Account for scrollbar width */
  margin: 0 !important;
  padding-top: 80px !important;
  overflow-x: hidden;
}

.v-application {
  background-color: #ffffff !important;
}

.section-container {
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

/* Table card styling */
.v-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  width: 100% !important;
}

.v-btn {
  text-transform: none;
  font-weight: 600;
}

.v-text-field,
.v-select {
  font-size: 14px;
}

.text-primary {
  color: #1976d2 !important;
}

/* Custom styling untuk match dengan gambar */
.v-field {
  border-radius: 8px;
}

.v-field--variant-outlined .v-field__outline {
  border-color: #d0d0d0;
}

.v-field--variant-outlined:hover .v-field__outline {
  border-color: #1976d2;
}

/* Ensure full white background */
body,
html {
  background-color: #ffffff !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
}

.v-main {
  background-color: #ffffff !important;
  width: 100% !important;
  max-width: none !important;
}

.v-container {
  background-color: #ffffff !important;
  max-width: none !important;
  width: 100% !important;
  padding-left: 16px !important;
  padding-right: 16px !important;
}

/* Generate buttons styling */
.v-btn--variant-elevated {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2) !important;
}

.v-btn .v-icon {
  margin-right: 8px !important;
}

/* Windows button styling */
.v-btn.bg-primary {
  background: #1976d2 !important;
}

/* Linux button styling */
.v-btn.bg-orange {
  background: #ff9800 !important;
  color: white !important;
}

/* Force full width on all elements */
* {
  box-sizing: border-box;
}

.v-row {
  margin: 0 !important;
  width: 100% !important;
}

.v-col {
  padding: 8px 12px;
}

/* Responsive scrollbar handling */
@media screen and (max-width: 1024px) {
  .white-page {
    width: 100vw !important;
  }
  .v-container {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
