import React from 'react';
import TouristPlaceList from './components/TouristPlaceList';
import TourPackagesList from './components/TourPackagesList';
import BangladeshTourTest from './components/BangladeshTourTest';
import HeroServer from './components/HeroServer';

const page = () => {
  return (
    <div className="bg-blue-400">
      <HeroServer />
      <TouristPlaceList />
      <TourPackagesList />
      <BangladeshTourTest />
    </div>
  );
};

export default page;