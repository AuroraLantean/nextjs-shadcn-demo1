"use client"
import {
  RowModel,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Fragment, useMemo, useState } from 'react'
import React from 'react'
import mData from '@/mockdata/MOCK_DATA.json'


export default function BasicTable() {
  /* 
{
  "id": 1,
  "first_name": "Isador",
  "last_name": "Kruger",
  "email": "ikruger0@huffingtonpost.com",
  "gender": "Male",
  "dob": "2023-04-28T11:19:35Z"
}
*/
  //https://react.dev/reference/react/useMemo cache the result of a calculation between re-renders
  const data = useMemo(() => mData, [])
  const columns = [
    {
      header: 'ID',
      accessKey: 'id',
      footer: 'ID',
    },
    {
      header: 'First name',
      accessKey: 'first_name',
      footer: 'First name',
    },
    {
      header: 'Last name',
      accessKey: 'last_name',
      footer: 'Last name',
    },
    {
      header: 'Email',
      accessKey: 'email',
      footer: 'Email',
    },
    {
      header: 'Gender',
      accessKey: 'gender',
      footer: 'Gender',
    },
    {
      header: 'Day of Birth',
      accessKey: 'dob',
      footer: 'Day of Birth',
    },
  ]
  const table = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <Fragment>
      <h1>BasicTable</h1>
      <table>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              ID
            </td>
          </tr>
        </tfoot>
      </table>
    </Fragment>
  )
}
/**
        <thead>
          <tr>
            <th>ID</th>
          </tr>
        </thead>
        
        <tbody>
                  <tr>
            <td>
              1
            </td>
          </tr>

        </tbody>
 */
