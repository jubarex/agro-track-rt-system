
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Property, Application } from '@/types';

interface ApplicationsMapProps {
  properties: (Property & { applications: Application[] })[];
}

const ApplicationsMap = ({ properties }: ApplicationsMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(localStorage.getItem('mapbox_token') || '');
  const [isTokenSet, setIsTokenSet] = useState(!!localStorage.getItem('mapbox_token'));

  useEffect(() => {
    if (!isTokenSet || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-54, -15], // Center of Brazil
      zoom: 3.5,
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    properties.forEach(property => {
      if (property.latitude && property.longitude) {
        const popupContent = `
          <div class="p-1">
            <h3 class="font-bold text-base">${property.name}</h3>
            <p class="text-sm">${property.address}</p>
            <p class="text-sm mt-1"><strong>Cultura:</strong> ${property.mainCulture}</p>
            <p class="text-sm"><strong>Aplicações:</strong> ${property.applications.length}</p>
          </div>
        `;
        
        new mapboxgl.Marker()
          .setLngLat([property.longitude, property.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
          .addTo(map.current!);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [isTokenSet, properties, token]);

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
          </p>
          <div className="space-y-2">
            <Label htmlFor="mapbox-token-app">Mapbox Public Token</Label>
            <div className="flex gap-2">
              <Input 
                id="mapbox-token-app"
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
      <div className="w-full h-[450px] rounded-md border" ref={mapContainer} />
  );
};

export default ApplicationsMap;
