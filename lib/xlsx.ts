import xlsx, { IJsonSheet } from "json-as-xlsx";
import data from '@/mockdata/data1.json'

export function downloadToExcel() {
  let columns: IJsonSheet[] = [
    {
      sheet: "Data",
      columns: [
        { label: "Data ID", value: "id" },
        { label: "First Name", value: "first_name" },
        { label: "Last Name", value: "last_name" },
        { label: "Email", value: "email" },
        { label: "Gender", value: "gender" },
        {
          label: "Date of Birth",
          value: (row) => new Date(row.dob as string).toLocaleDateString(),
        },
      ],
      content: data,
    },
  ];

  let settings = {
    fileName: "Data Excel",
  };

  xlsx(columns, settings);
}
