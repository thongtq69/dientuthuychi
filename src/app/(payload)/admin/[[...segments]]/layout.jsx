import { RootLayout } from '@payloadcms/next/layouts'
import config from '../../../../payload.config'
import { importMap } from '../../importMap'
import { serverFunction } from '../../serverFunction'

const Layout = ({ children }) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {children}
  </RootLayout>
)

export default Layout
