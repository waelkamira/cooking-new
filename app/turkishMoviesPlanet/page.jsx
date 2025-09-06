'use client';
import React from 'react';
import PlanetForm from '../../components/planetForm';
export default function MoviesPlanet() {
  return (
    <PlanetForm
      planetImage="/images/picatcu.png"
      planetName="أفلام"
      planetSerieses=""
      planetColor="yellow"
      route="turkish-movies"
    />
  );
}
