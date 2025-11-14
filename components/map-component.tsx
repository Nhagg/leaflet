'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

    // Khởi tạo map
    const map = L.map(mapContainerRef.current).setView([21.0285, 105.8542], 13)

    // Thêm tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    // Thêm marker cho Hồ Hoàn Kiếm
    const marker1 = L.marker([21.0285, 105.8542], { icon }).addTo(map)
    marker1.bindPopup('<b>Hồ Hoàn Kiếm</b><br>Trung tâm Hà Nội')

    // Thêm marker cho Văn Miếu
    const marker2 = L.marker([21.0277, 105.8355], { icon }).addTo(map)
    marker2.bindPopup('<b>Văn Miếu - Quốc Tử Giám</b><br>Di tích lịch sử')

    // Thêm marker cho Nhà Hát Lớn
    const marker3 = L.marker([21.0233, 105.8582], { icon }).addTo(map)
    marker3.bindPopup('<b>Nhà Hát Lớn Hà Nội</b><br>Kiến trúc Pháp')

    // Thêm circle
    const circle = L.circle([21.0285, 105.8542], {
      color: 'blue',
      fillColor: '#30a3f3',
      fillOpacity: 0.2,
      radius: 500
    }).addTo(map)
    circle.bindPopup('Bán kính 500m từ Hồ Hoàn Kiếm')

    // Thêm polygon
    const polygon = L.polygon([
      [21.0400, 105.8500],
      [21.0400, 105.8600],
      [21.0300, 105.8600],
      [21.0300, 105.8500]
    ], {
      color: 'green',
      fillColor: '#90ee90',
      fillOpacity: 0.3
    }).addTo(map)
    polygon.bindPopup('Khu vực ví dụ')

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
            <CardTitle className="text-sm font-medium">Markers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Đánh dấu vị trí trên bản đồ với popup thông tin
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Circle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Vẽ vùng hình tròn với bán kính tùy chỉnh
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Polygon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Vẽ vùng hình đa giác tùy chỉnh
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
