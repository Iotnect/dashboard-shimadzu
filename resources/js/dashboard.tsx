import { useEffect, useState } from 'react';
import {
    Activity, Camera, Check, CircleAlert, ClipboardList, Clock3, FileVideo,
    LayoutDashboard, LogOut, PanelLeftClose, PanelLeftOpen, ScanLine, TriangleAlert, Video, VideoOff,
} from 'lucide-react';
import type { SharedData } from '@/app';
import { Brand, ThemeToggle, type ThemeControl } from '@/components/shell-controls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { checklist, events, type InspectionResult } from '@/demo-data';

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
    const playable = videoUrl && !videoError;

    return (
        <Card className="panel camera-panel" aria-labelledby="camera-title">
            <div className="panel-heading">
                <span className="panel-icon camera-icon"><Video aria-hidden="true" /></span>
                <div>
                    <h2 id="camera-title">Camera 01</h2>
                    <p>Inspection camera</p>
                </div>
                <Badge variant="outline" className="source-badge"><span /> Demo replay</Badge>
            </div>
            <div className="camera-screen">
                {playable ? (
                    <video src={videoUrl} controls playsInline preload="metadata"
                        aria-label="Camera 01 demo footage" onError={() => setVideoError(true)} />
                ) : (
                    <>
                        <div className="viewfinder" aria-hidden="true">
                            <span /><span /><span /><span />
                        </div>
                        <div className="screen-empty" role={videoError ? 'status' : undefined}>
                            <span className="screen-icon"><VideoOff aria-hidden="true" /></span>
                            <strong>{videoError ? 'Footage could not be played' : 'No demo footage yet'}</strong>
                            <p>{videoError ? 'Check the MP4 file and refresh the dashboard.' : 'Add camera-01.mp4 to load a demo replay.'}</p>
                        </div>
                    </>
                )}
            </div>
            <div className="camera-footer">
                <span><FileVideo size={15} aria-hidden="true" /> Demo video file</span>
                <span>MP4</span>
            </div>
        </Card>
    );
}

function ResultChip({ result }: { result: InspectionResult }) {
    return (
        <Badge variant="outline" className={`result-chip ${result}`}>
            {result === 'matched' ? 'Matched' : 'Mismatch'}
        </Badge>
    );
}

function Checklist() {
    const matched = checklist.filter((item) => item.result === 'matched').length;

    return (
        <Card className="panel checklist-panel" aria-labelledby="checklist-title">
            <div className="panel-heading">
                <span className="panel-icon"><ClipboardList aria-hidden="true" /></span>
                <div>
                    <h2 id="checklist-title">Inspection checklist</h2>
                    <p>Sample detection results</p>
                </div>
            </div>
            <div className="checklist-summary">
                <div className="summary-label">
                    <span>Criteria matched</span>
                    <span className="summary-count">{matched} <span>/ {checklist.length}</span></span>
                </div>
                <progress className="check-progress" value={matched} max={checklist.length} aria-label="Sample criteria matched" />
            </div>
            <ul className="checklist-items">
                {checklist.map((item) => {
                    const Icon = item.result === 'matched' ? Check : CircleAlert;
                    return (
                        <li className="checklist-item" key={item.label}>
                            <span className={`result-icon ${item.result}`}><Icon aria-hidden="true" /></span>
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
                    <p>Sample inspection events</p>
                </div>
            </div>
            <ul className="event-items">
                {events.map((event) => {
                    const Icon = event.result === 'mismatch' ? TriangleAlert : Check;
                    return (
                        <li className="event-item" key={event.title}>
                            <span className={`result-icon ${event.result}`}><Icon aria-hidden="true" /></span>
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
                    <div className="page-heading">
                        <div className="page-title">
                            <span className="detection-icon"><ScanLine aria-hidden="true" /></span>
                            <div><h1>AI Detection</h1><p>Inspection station</p></div>
                        </div>
                        <Badge variant="outline" className="demo-badge"><Camera size={14} aria-hidden="true" /> Demo mode</Badge>
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
