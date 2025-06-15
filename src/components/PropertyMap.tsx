
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

const PropertyMap = ({ latitude, longitude, zoom = 12 }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [token, setToken] = useState(localStorage.getItem('mapbox_token') || '');
  const [isTokenSet, setIsTokenSet] = useState(!!localStorage.getItem('mapbox_token'));

  useEffect(() => {
    if (!isTokenSet || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: zoom,
    });

    marker.current = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [isTokenSet]);

  useEffect(() => {
    if (map.current && marker.current) {
        if (map.current.getCenter().lng !== longitude || map.current.getCenter().lat !== latitude) {
            map.current.flyTo({ center: [longitude, latitude], zoom });
            marker.current.setLngLat([longitude, latitude]);
        }
    }
  }, [latitude, longitude, zoom]);

  const handleSetToken = () => {
    if(token) {
        localStorage.setItem('mapbox_token', token);
        setIsTokenSet(true);
    }
  };

  if (!isTokenSet) {
    return (
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Configurar Visualização do Mapa</CardTitle>
          <CardDescription>
            Para visualizar o mapa, insira seu token de acesso público do Mapbox. O token será salvo no seu navegador.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Você pode obter um token gratuito em{' '}
            <a href="https://account.mapbox.com/access-tokens" target="_blank" rel="noopener noreferrer" className="underline text-primary">
              mapbox.com
            </a>. 
            Para um aplicativo real, esta chave deve ser configurada de forma segura, como com a integração Supabase.
          </p>
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <div className="flex gap-2">
              <Input 
                id="mapbox-token"
                type="password" 
                placeholder="pk.ey..." 
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSetToken()}
              />
              <Button onClick={handleSetToken} disabled={!token}>Salvar Token</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
      <div className="w-full h-96 rounded-md border" ref={mapContainer} />
  );
};

export default PropertyMap;
