/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import { RootPage } from '@payloadcms/next/views'
import configPromise from '../../../../payload.config.js'
import { importMap } from '../../importMap.js'

import React from 'react'

export default async function Page({ params, searchParams }) {
  return (
    <RootPage
      config={configPromise}
      importMap={importMap}
      params={params}
      searchParams={searchParams}
    />
  )
}
