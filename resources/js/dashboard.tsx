import { useEffect, useState } from 'react';
import {
    Activity, Check, CircleHelp, ClipboardList, Clock3,
    LayoutDashboard, LogOut, PanelLeftClose, PanelLeftOpen, ScanLine, TriangleAlert, Video, VideoOff,
} from 'lucide-react';
import type { SharedData } from '@/app';
import { Brand, ThemeToggle, type ThemeControl } from '@/components/shell-controls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { checklist, events, inspectionResults, type InspectionResult } from '@/demo-data';

export type DashboardData = {
    kind: 'dashboard';
    dashboardUrl: string;
    logoutUrl: string;
    operator: string;
    videoUrl: string | null;
};

const dateFormat = new Intl.DateTimeFormat('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur', weekday: 'short', day: 'numeric', month: 'short',
});
const timeFormat = new Intl.DateTimeFormat('en-MY', {
    timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
const resultPresentation = {
    ok: { label: 'OK', icon: Check },
    review: { label: 'Needs review', icon: CircleHelp },
    error: { label: 'Error', icon: TriangleAlert },
};

function Clock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const timer = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <time className="top-clock" dateTime={now.toISOString()}>
            <Clock3 size={15} aria-hidden="true" />
            <span className="clock-date">{dateFormat.format(now)}</span>
            <span className="clock-time">{timeFormat.format(now)} MYT</span>
        </time>
    );
}

function CameraPanel({ videoUrl }: { videoUrl: string | null }) {
    const [videoError, setVideoError] = useState(false);
    const status = videoError ? 'Unavailable' : videoUrl ? 'Replay' : 'Live feed';

    return (
        <Card className="panel camera-panel" aria-labelledby="camera-title">
            <div className="panel-heading">
                <span className="panel-icon camera-icon"><Video aria-hidden="true" /></span>
                <div>
                    <h2 id="camera-title">Camera 01</h2>
                    <p>Inspection camera</p>
                </div>
                <Badge variant="outline" className="source-badge">
                    <span /> {status}
                </Badge>
            </div>
            <div className="camera-screen">
                {videoUrl && !videoError ? (
                    <video src={videoUrl} controls playsInline preload="metadata"
                        aria-label="Camera 01 recording" onError={() => setVideoError(true)} />
                ) : (
                    <>
                        <div className="viewfinder" aria-hidden="true">
                            <span /><span /><span /><span />
                        </div>
                        <div className="screen-empty" role={videoError ? 'status' : undefined}>
                            <span className="screen-icon"><VideoOff aria-hidden="true" /></span>
                            <strong>{videoError ? 'Footage could not be played' : 'No footage available'}</strong>
                            <p>{videoError ? 'Check the recording and refresh the dashboard.' : 'Camera recordings appear here when available.'}</p>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
}

function ResultChip({ result }: { result: InspectionResult }) {
    return (
        <Badge variant="outline" className="result-chip" data-result={result}>
            {resultPresentation[result].label}
        </Badge>
    );
}

function Checklist() {
    const counts = { ok: 0, review: 0, error: 0 };
    for (const item of checklist) {
        counts[item.result]++;
    }

    return (
        <Card className="panel checklist-panel" aria-labelledby="checklist-title">
            <div className="panel-heading">
                <span className="panel-icon"><ClipboardList aria-hidden="true" /></span>
                <div>
                    <h2 id="checklist-title">Inspection checklist</h2>
                    <p>Inspection results</p>
                </div>
            </div>
            <ul className="checklist-summary" aria-label="Inspection status summary">
                {inspectionResults.map((result) => (
                    <li key={result} data-result={result}>
                        <strong>{counts[result]}</strong>
                        <span>{resultPresentation[result].label}</span>
                    </li>
                ))}
            </ul>
            <ul className="checklist-items">
                {checklist.map((item) => {
                    const Icon = resultPresentation[item.result].icon;
                    return (
                        <li className="checklist-item" key={item.label}>
                            <span className="result-icon" data-result={item.result}><Icon aria-hidden="true" /></span>
                            <div>
                                <h3>{item.label}</h3>
                                <p>{item.description}</p>
                            </div>
                            <ResultChip result={item.result} />
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
}

function EventLog() {
    return (
        <Card className="panel event-panel" aria-labelledby="events-title">
            <div className="panel-heading">
                <span className="panel-icon"><Activity aria-hidden="true" /></span>
                <div>
                    <h2 id="events-title">Event log</h2>
                    <p>Camera 01 activity</p>
                </div>
            </div>
            <ul className="event-items">
                {events.map((event) => {
                    const Icon = resultPresentation[event.result].icon;
                    return (
                        <li className="event-item" key={event.title}>
                            <span className="result-icon" data-result={event.result}><Icon aria-hidden="true" /></span>
                            <div><h3>{event.title}</h3><p>{event.description}</p></div>
                            <ResultChip result={event.result} />
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
}

export function Dashboard({
    dashboardUrl, logoutUrl, operator, videoUrl, logoUrl, faviconUrl, csrfToken, isDark, toggleTheme,
}: DashboardData & SharedData & ThemeControl) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try {
            return localStorage.getItem('shimadzu-sidebar-collapsed') === 'true';
        } catch {
            return false;
        }
    });
    const SidebarIcon = sidebarCollapsed ? PanelLeftOpen : PanelLeftClose;
    const sidebarLabel = sidebarCollapsed ? 'Expand sidebar' : 'Minimise sidebar';

    function toggleSidebar() {
        const collapsed = !sidebarCollapsed;
        setSidebarCollapsed(collapsed);

        try {
            localStorage.setItem('shimadzu-sidebar-collapsed', String(collapsed));
        } catch {}
    }

    const sidebarToggle = (
        <Button type="button" variant="ghost" size="icon" className="sidebar-toggle"
            aria-label={sidebarLabel} title={sidebarLabel} aria-expanded={!sidebarCollapsed}
            aria-controls="dashboard-navigation" onClick={toggleSidebar}>
            <SidebarIcon aria-hidden="true" />
        </Button>
    );

    return (
        <div className="dashboard-shell" data-sidebar-collapsed={sidebarCollapsed}>
            <header className="topbar">
                <div className="topbar-brand"><Brand logoUrl={logoUrl} faviconUrl={faviconUrl} /></div>
                <span className="topbar-title">Monitoring console</span>
                <div className="topbar-tools">
                    <Clock />
                    <div className="mobile-sidebar-toggle">{sidebarToggle}</div>
                    <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
                </div>
            </header>
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <Brand logoUrl={logoUrl} faviconUrl={faviconUrl} />
                </div>
                <div className="desktop-sidebar-toggle">{sidebarToggle}</div>
                <nav id="dashboard-navigation" className="sidebar-nav" aria-label="Main navigation">
                    <a href={dashboardUrl} aria-current="page" aria-label="Dashboard" title="Dashboard">
                        <LayoutDashboard aria-hidden="true" /><span>Dashboard</span>
                    </a>
                </nav>
                <footer className="sidebar-footer">
                    <span className="operator-icon" aria-hidden="true">{operator.charAt(0)}</span>
                    <div className="operator-info"><strong>{operator}</strong><span>Operator</span></div>
                    <form method="post" action={logoutUrl}>
                        <input type="hidden" name="_token" value={csrfToken} />
                        <Button type="submit" variant="ghost" size="icon" className="logout-button"
                            aria-label="Sign out" title="Sign out">
                            <LogOut aria-hidden="true" />
                        </Button>
                    </form>
                </footer>
            </aside>
            <main className="dashboard-main">
                <div className="dashboard-content">
                    <div className="page-title">
                        <span className="detection-icon"><ScanLine aria-hidden="true" /></span>
                        <div><h1>AI Detection</h1><p>Inspection station</p></div>
                    </div>
                    <div className="monitor-grid">
                        <CameraPanel videoUrl={videoUrl} />
                        <Checklist />
                    </div>
                    <EventLog />
                </div>
            </main>
        </div>
    );
}
