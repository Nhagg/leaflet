'use client'

import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Import Map component dynamically to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/map-component'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] items-center justify-center rounded-lg border bg-muted">
      <p className="text-muted-foreground">Đang tải bản đồ...</p>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Leaflet.js với React</CardTitle>
          <CardDescription>
            Ví dụ về bản đồ tương tác sử dụng Leaflet.js trong Next.js
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MapComponent />
        </CardContent>
      </Card>
    </main>
  )
}
