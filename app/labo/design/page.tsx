import type { Metadata } from 'next'
import DesignPreview from '@/components/lab/DesignPreview'

export const metadata: Metadata = {
  title: 'Maquette · nouveau design Automation Lab',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <DesignPreview />
}
