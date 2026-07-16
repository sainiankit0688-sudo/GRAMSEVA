// FROZEN — DO NOT MODIFY — Phase 3 Complete
'use client';

import SOSButton from './SOSButton';

export default function EmergencyShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SOSButton />
    </>
  );
}
