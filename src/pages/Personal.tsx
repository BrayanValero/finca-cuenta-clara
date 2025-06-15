import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Personal = () => {
  const { t } = useLanguage();
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{t('personal') || 'Personal'}</h2>
    </div>
  );
};
export default Personal;
