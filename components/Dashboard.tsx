'use client';
import React, { useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import ClientLayout from './layout/ClientLayout';
import SearchView from './views/SearchView';
import RankingView from './views/RankingView';
import ProblemsView from './views/ProblemsView';
import FavoritesView from './views/FavoritesView';
import AccountView from './views/AccountView';
import ClientLayout from './layout/ClientLayout';
import type { ViewType } from '@/lib/types';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('ranking');

  const viewComponents = {
   // search: <SearchView />,
    ranking: <RankingView />,
    //problems: <ProblemsView />,
    //favorites: <FavoritesView />,
    account: <AccountView />
  };

  return (
    <ClientLayout activeView={activeView} setActiveView={setActiveView}>
      {activeView in viewComponents ? viewComponents[activeView as keyof typeof viewComponents] : <RankingView />}
    </ClientLayout>
  );
};

export default Dashboard;