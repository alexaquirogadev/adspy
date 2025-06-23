'use client';
import React, { useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import ClientLayout from './layout/ClientLayout';
import SearchView from './views/SearchView';
import RankingView from './views/RankingView';
import ProblemsView from './views/ProblemsView';
import FavoritesView from './views/FavoritesView';
import AccountView from './views/AccountView';
import AdminView from './views/AdminView';
import ClientLayout from './layout/ClientLayout';

type ViewType = 'search' | 'ranking' | 'problems' | 'favorites' | 'account';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('search');

  const viewComponents = {
    search: <SearchView />,
    ranking: <RankingView />,
    problems: <ProblemsView />,
    favorites: <FavoritesView />,
    account: <AccountView />
  };

  return (
    <ClientLayout activeView={activeView} setActiveView={setActiveView}>
      {viewComponents[activeView] || <SearchView />}
    </ClientLayout>
  );
};

export default Dashboard;