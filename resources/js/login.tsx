import { useState } from 'react';
import { ArrowRight, CircleAlert, Eye, EyeOff } from 'lucide-react';
import type { SharedData } from '@/app';
import { Brand, ThemeToggle, type ThemeControl } from '@/components/shell-controls';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export type LoginData = {
    kind: 'login';
    loginUrl: string;
    username: string;
    errors: { username?: string[]; password?: string[]; credentials?: string[] };
};

export function Login({ loginUrl, username, errors, logoUrl, csrfToken, isDark, toggleTheme }:
    LoginData & SharedData & ThemeControl) {
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const PasswordIcon = showPassword ? EyeOff : Eye;

    return (
        <div className="login-shell">
            <header className="login-header">
                <Brand logoUrl={logoUrl} />
                <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
            </header>
            <main className="login-main">
                <Card className="login-card">
                    <CardContent className="login-content">
                        <h1>Sign in</h1>
                        <p className="muted">Access the Shimadzu monitoring dashboard.</p>
                        <form className="login-form" method="post" action={loginUrl}
                            onSubmit={() => setSubmitting(true)} aria-busy={submitting}>
                            <input type="hidden" name="_token" value={csrfToken} />
                            {errors.credentials?.[0] && (
                                <p className="form-error" role="alert" id="credential-error">
                                    <CircleAlert aria-hidden="true" /> {errors.credentials[0]}
                                </p>
                            )}
                            <div className="field">
                                <label htmlFor="username">Username</label>
                                <Input id="username" name="username" autoComplete="username" autoCapitalize="none"
                                    spellCheck={false} defaultValue={username} placeholder="Enter username"
                                    required maxLength={100} aria-invalid={Boolean(errors.username || errors.credentials)}
                                    aria-describedby={errors.username ? 'username-error' : errors.credentials ? 'credential-error' : undefined} />
                                {errors.username?.[0] && <p className="field-error" id="username-error">{errors.username[0]}</p>}
                            </div>
                            <div className="field">
                                <label htmlFor="password">Password</label>
                                <div className="password-field">
                                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password" placeholder="Enter password" required
                                        maxLength={255} aria-invalid={Boolean(errors.password || errors.credentials)}
                                        aria-describedby={errors.password ? 'password-error' : errors.credentials ? 'credential-error' : undefined} />
                                    <Button type="button" variant="ghost" size="icon" className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                        <PasswordIcon aria-hidden="true" />
                                    </Button>
                                </div>
                                {errors.password?.[0] && <p className="field-error" id="password-error">{errors.password[0]}</p>}
                            </div>
                            <Button className="sign-in" type="submit" disabled={submitting}>
                                {submitting ? 'Signing in…' : 'Sign in'}
                                <ArrowRight aria-hidden="true" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
