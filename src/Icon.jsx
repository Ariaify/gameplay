import React from 'react';
const paths={
 grid:<><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
 users:<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/></>,
 flag:<path d="M4 22V3m0 1c5-4 10 4 16 0v11c-6 4-11-4-16 0"/>,
 chat:<><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 2 2-6v-4.5a8.5 8.5 0 1 1 18 0Z"/><path d="M7 10h10m-10 4h6"/></>,
 trophy:<path d="M8 3h8v6a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 5 4m7-7h4v3a4 4 0 0 1-5 4m-3 1v5m-4 3h8m-7-3h6v3"/>,
 spark:<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Zm8-2v4m-2-2h4"/>,
 plus:<path d="M12 5v14M5 12h14"/>,arrow:<path d="M5 12h14m-5-5 5 5-5 5"/>,up:<path d="M6 18 18 6M6 6h12v12"/>,
 check:<path d="m5 12 4 4L19 6"/>,checkcircle:<><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
 leaf:<path d="M20 3C9 2 3 6 3 12c0 5 6 8 10 5s7-8 7-14ZM3 21 15 9"/>,
 bolt:<path d="m13 2-9 12h7l-1 8 10-12h-7l1-8Z"/>,search:<><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/></>,
 heart:<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
 shield:<><path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Z"/><path d="m8 11 3 3 5-5"/></>,
 lock:<><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/></>,download:<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>,
 edit:<path d="m16 3 5 5L9 20l-6 1 1-6L16 3Zm-3 3 5 5"/>,info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/></>,
 cross:<path d="m6 6 12 12M18 6 6 18"/>,compass:<><circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/></>,book:<path d="M3 3h6a4 4 0 0 1 3 2 4 4 0 0 1 3-2h6v17h-6a4 4 0 0 0-3 2 4 4 0 0 0-3-2H3V3Zm9 2v17"/>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
 moon:<path d="M21 13A9 9 0 0 1 11 3a9 9 0 1 0 10 10Z"/>,target:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
 upload:<path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6"/>,chevron:<path d="m9 5 7 7-7 7"/>,back:<path d="M19 12H5m5-5-5 5 5 5"/>,
 crown:<path d="m3 5 5 4 4-6 4 6 5-4-2 14H5L3 5Zm2 17h14"/>,menu:<path d="M4 6h16M4 12h16M4 18h16"/>,
};
export default function Icon({name,className='',...props}){return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]||paths.spark}</svg>;}
