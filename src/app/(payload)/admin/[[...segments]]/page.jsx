import { RootPage } from '@payloadcms/next/views'
import config from '../../../../payload.config'
import { importMap } from '../../importMap'

const Page = (props) => RootPage({ ...props, config, importMap })

export default Page
