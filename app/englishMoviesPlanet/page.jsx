'use client';
import React from 'react';
import PlanetForm from '../../components/planetForm';
export default function MoviesPlanet() {
  return (
    <PlanetForm
      planetImage="/images/house.png"
      planetName="أفلام لغة إنجليزية"
      planetSerieses=""
      planetColor="red"
      route="english-movies"
    />
  );
}
