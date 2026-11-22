// @vitest-environment jsdom

import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/script', () => ({
  default: ({
    id,
    src,
    children,
  }: {
    id?: string;
    src?: string;
    children?: React.ReactNode;
  }) => (
    <div data-testid={id ?? src} id={id} data-src={src}>
      {typeof children === 'string' ? children : null}
    </div>
  ),
}));

describe('GoogleAnalytics', () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it('renders nothing when the measurement id is unset', async () => {
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', '');
    const { GoogleAnalytics } = await import('./GoogleAnalytics');
    const { container } = render(<GoogleAnalytics />);
    expect(container).toBeEmptyDOMElement();
  });

  it('loads gtag scripts when the measurement id is set', async () => {
    const measurementId = `G-TEST');window.compromised=true;//</script>`;
    vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', measurementId);
    const { GoogleAnalytics } = await import('./GoogleAnalytics');
    const { GA_SCRIPT_ID } = await import('./constants');
    const { container } = render(<GoogleAnalytics />);

    expect(
      container.querySelector(
        `[data-src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}"]`,
      ),
    ).not.toBeNull();
    const inlineScript =
      container.querySelector(`#${GA_SCRIPT_ID}`)?.textContent ?? '';
    expect(inlineScript).toContain(
      `gtag('config',${JSON.stringify(measurementId).replace(/</g, '\\u003c')});`,
    );
    expect(inlineScript).not.toContain('</script>');
  });
});
