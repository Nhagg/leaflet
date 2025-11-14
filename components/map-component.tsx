'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import locationsData from './locations.json'

// Interface cho marker data
interface MarkerData {
  lat: number
  lng: number
  name: string
  id: string
  pin?: string
}

interface LocationResult {
  marker?: MarkerData
  name?: string
}

// Fix cho icon mặc định của Leaflet trong Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

export default function MapComponent() {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Kiểm tra nếu map đã được khởi tạo
    if (mapRef.current !== null || !mapContainerRef.current) return

    // Lấy markers từ file locations.json
    const results = (locationsData as any).results as LocationResult[]
    const markers = results
      .filter((result) => result.marker && result.marker.lat && result.marker.lng)
      .map((result) => result.marker!)
    
    // Tính toán center từ markers (trung bình các tọa độ)
    let centerLat = 33.811
    let centerLng = -117.922
    let zoom = 15

    if (markers.length > 0) {
      centerLat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length
      centerLng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length
    }

    // Khởi tạo map với center tính toán được
    const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], zoom)

    // Thêm tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Tạo marker cluster group với custom options
    const markerClusterGroup = (L as any).markerClusterGroup({
      chunkedLoading: true,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 80,
      iconCreateFunction: function(cluster: any) {
        const count = cluster.getChildCount()
        let size = 'small'
        let sizeClass = 'marker-cluster-small'
        
        if (count >= 100) {
          size = 'large'
          sizeClass = 'marker-cluster-large'
        } else if (count >= 10) {
          size = 'medium'
          sizeClass = 'marker-cluster-medium'
        }
        
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `marker-cluster ${sizeClass}`,
          iconSize: L.point(40, 40)
        })
      }
    })

    // Thêm tất cả markers vào cluster group
    markers.forEach((markerData) => {
      const marker = L.marker([markerData.lat, markerData.lng], { icon })
      marker.bindPopup(`<b>${markerData.name}</b><br>${markerData.pin || 'Location'}`)
      markerClusterGroup.addLayer(marker)
    })

    // Thêm cluster group vào map
    map.addLayer(markerClusterGroup)

    // Fit bounds để hiển thị tất cả markers
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }

    mapRef.current = map

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div 
        ref={mapContainerRef} 
        className="h-[600px] w-full rounded-lg border shadow-sm"
      />
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Disney Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {(() => {
                const results = (locationsData as any).results as LocationResult[]
                const count = results.filter(r => r.marker?.lat && r.marker?.lng).length
                return `Hiển thị ${count} địa điểm từ Disneyland Resort`
              })()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Marker Clustering</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Zoom out để gom nhóm markers, zoom in để xem chi tiết từng địa điểm
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Interactive</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Click vào cluster hoặc marker để xem thông tin chi tiết
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
