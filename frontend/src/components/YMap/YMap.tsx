// import React, { useState } from 'react';
// import { SearchControl, Map, Placemark } from '@pbe/react-yandex-maps';
//
// interface Props {
//     setAddress: (address: {
//         city?: string;
//         street?: string;
//         house?: string;
//         lat: number;
//         lon: number;
//         fullAddress: string;
//     }) => void;
// }
//
// const YMap = ({ setAddress }: Props) => {
//     const [coords, setCoords] = useState<[number, number]>([55.75, 37.57]);
//
//     const handleBoundsChange = async (e: any) => {
//         const map = e.get('target');
//
//         const center = map.getCenter();
//
//         setCoords(center);
//
//         const ymaps = (window as any).ymaps;
//
//         const res = await ymaps.geocode(center);
//
//         const firstGeoObject = res.geoObjects.get(0);
//
//         const fullAddress = firstGeoObject.getAddressLine();
//
//         const components =
//             firstGeoObject.properties.get('metaDataProperty').GeocoderMetaData
//                 .Address.Components;
//
//         const city = components.find((c: any) => c.kind === 'locality')?.name;
//         const street = components.find((c: any) => c.kind === 'street')?.name;
//         const house = components.find((c: any) => c.kind === 'house')?.name;
//
//         setAddress({
//             city,
//             street,
//             house,
//             lat: center[0],
//             lon: center[1],
//             fullAddress,
//         });
//     };
//
//     return (
//         <Map
//             defaultState={{
//                 center: coords,
//                 zoom: 15,
//                 controls: [],
//             }}
//             width="100%"
//             height="400px"
//             suppressMapOpenBlock
//             options={{
//                 yandexMapDisablePoiInteractivity: true,
//             }}
//             onBoundsChange={handleBoundsChange}
//         >
//             <Placemark geometry={coords} />
//         </Map>
//     );
// };
//
// export default YMap;
