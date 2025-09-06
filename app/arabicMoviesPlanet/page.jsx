'use client';
import React from 'react';
import PlanetForm from '../../components/planetForm';
export default function MoviesPlanet() {
  return (
    <PlanetForm
      planetImage="/images/Movie.png"
      planetName="أفلام"
      planetSerieses=""
      planetColor="red"
      route="arabic-movies"
    />
  );
}
