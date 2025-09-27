"use client";

import MixingMasteringGrid from '@/components/mixingmasteringGrid';

interface MixingMasteringProps {
  setLoading: (loading: boolean) => void;
}

const Mixingmastering = ({ setLoading }: MixingMasteringProps) => {
  return <MixingMasteringGrid setLoading={setLoading} />;
};

export default Mixingmastering;