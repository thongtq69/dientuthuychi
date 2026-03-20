/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import { RootLayout } from '@payloadcms/next/layouts'
import configPromise from '../../../../payload.config.js'
import { importMap } from '../../importMap.js'
import { serverFunction } from '../../serverFunction.js'

import React from 'react'

export default async function Layout({ children, params }) {
  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      params={params}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  )
}
