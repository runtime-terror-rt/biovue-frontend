export const downloadSampleCSV = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/download-sample`,
      {
        method: "GET",
        headers: {
          "Content-Type": "text/csv",
          "ngrok-skip-browser-warning": "any",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to download CSV");
    }

    // Get CSV blob
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // File name
    link.setAttribute("download", "sample-products.csv");

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSV Download Error:", error);
  }
};

const convertToCSV = (data: any[]) => {
  if (!data || data.length === 0) return "";
  
  // Define mapping for headers and their corresponding keys
  const headerMap = {
    id: "ID",
    name: "Product Name",
    price: "Price",
    category: "Category",
    redirect_url: "Redirect URL",
    status: "Status",
    description: "Description",
    created_at: "Created At"
  };

  const keys = Object.keys(headerMap) as (keyof typeof headerMap)[];
  const headerRow = keys.map(key => headerMap[key]).join(",");

  const rows = data.map(item => {
    return keys.map(key => {
      let val = item[key];
      if (val === null || val === undefined) return '""';
      // Handle commas and quotes in values
      const stringVal = String(val).replace(/"/g, '""');
      return `"${stringVal}"`;
    }).join(",");
  });

  return [headerRow, ...rows].join("\n");
};

export const downloadProductsXlsx = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "any",
          "Accept": "application/json"
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products for export");
    }

    const json = await response.json();
    const products = json.data || [];

    const csvContent = convertToCSV(products);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products.csv");

    document.body.appendChild(link);
    link.click();

    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Products Export Error:", error);
    throw error;
  }
};

