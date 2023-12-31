//"use client"

//import { Fragment } from 'react'
//import { DateTime } from 'luxon'
import { Button } from '@/components/ui/button'
import BasicTable from '@/components/tables/basicTable'
import data from '@/mockdata/data1.json'
import { columns } from '@/constants/data1columns'

export default async function TablePage() {
  //https://react.dev/reference/react/useMemo cache the result of a calculation between re-renders
  //const data = mData;//JSON.parse(JSON.stringify(mData))
  //text-light-2

  return (
    <div className="container py-10 mx-auto ">
      <h1 className='font-bold '>Tanstack Table</h1>
      <BasicTable data={data} columns={columns} />
    </div>
  )
}
/**
    <Button className='bg-primary-500 rounded'
        isLoading={isLoading}
        disabled={isLoading}
        onClick={() => { }}>
        Button1
      </Button>
  
 */