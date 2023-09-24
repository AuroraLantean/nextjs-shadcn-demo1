"use client"
import { ColumnDef } from "@tanstack/react-table"
import data from '@/mockdata/data1.json'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
/*{
"id": 1,
"first_name": "Isador",
"last_name": "Kruger",
"email": "ikruger0@huffingtonpost.com",
"gender": "Male",
"dob": "2023-04-28T11:19:35Z"
}*/
export type dataT = (typeof data)[number]
/* type dataT = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  dob: string;
}
"oepn" | "completed" | "closed" | "failed"
*/

export const columns: ColumnDef<dataT>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    footer: 'ID',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    header: 'First',
    accessorKey: 'first_name',
    footer: 'First name',
  },
  {
    header: 'Last',
    accessorKey: 'last_name',
    footer: 'Last name',
  },
  {
    accessorKey: 'email',
    footer: 'Email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    header: 'Gender',
    accessorKey: 'gender',
    footer: 'Gender',
  },
  {
    accessorKey: 'dob',
    footer: 'Date',
    cell: ({ row }) => {
      const date_of_birth = row.getValue("dob");
      const formatted = new Date(date_of_birth as string).toLocaleDateString();
      return (<div className="font-medium" > {formatted} </div>);
      //return DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED)
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    header: 'Actions',
    footer: 'Actions',
    id: "actions",
    cell: ({ row }) => {
      const person = row.original;
      const personId = person.id

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">

              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="!bg-primary text-light-2">

            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(personId.toString())}
            >
              Copy item id
            </DropdownMenuItem>

            <DropdownMenuItem>View item details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }
];
/** adding cell function => functions cannot be passed directly to client components unless you explicitly expose it by marking it with "use server"... cell: function => "use client"
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
<DropdownMenuSeparator />

  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
 */
/** @type import('@tanstack/react-table').ColumnDef<any> */
/*export const columns: any[] = [
  {
    header: 'Name',
    columns: [
      {
        header: 'First',
        accessorKey: 'first_name',
        footer: 'First name',
      },
      {
        header: 'Last',
        accessorKey: 'last_name',
        footer: 'Last name',
      },
    ],
  },
  // {
  //   header: 'Name',
  //   accessorFn: row => `${row.first_name} ${row.last_name}`,
  // },
  // {
  //   header: 'First name',
  //   accessorKey: 'first_name',
  //   footer: 'First name',
  // },
  // {
  //   header: 'Last name',
  //   accessorKey: 'last_name',
  //   footer: 'Last name',
  // },
  },
]*/