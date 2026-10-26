/*! Own-license bridge v2 */
(function () {
  const DEFAULT_API_BASE = 'https://lovable-ai-free-credit.vercel.app';
  const KEY_RE = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

  function isOwnFormat(key) {
    return KEY_RE.test(String(key || '').trim().toUpperCase());
  }

  async function getApiBase() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        const s = await chrome.storage.local.get(['api_base']);
        if (s.api_base) return String(s.api_base).replace(/\/$/, '');
      }
    } catch (_) {}
    return DEFAULT_API_BASE.replace(/\/$/, '');
  }

  async function validateOwn(key) {
    const apiBase = await getApiBase();
    const url = apiBase + '/api/validate-key';
    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: String(key).trim().toUpperCase() }),
      });
    } catch (e) {
      return { ok: false, error: 'Cannot reach license server: ' + apiBase };
    }
    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch (_) {}
    if (!res.ok || !data.valid) {
      return { ok: false, error: data.error || ('Invalid license (' + res.status + ')') };
    }
    return { ok: true, plan: data.plan, expires_at: data.expires_at, label: data.label };
  }

  function licenseSuccessBody(key, info) {
    return {
      ok: true, valid: true, licenseKey: key, key: key,
      plan: info.plan || '30days', expires_at: info.expires_at,
      expiresAt: info.expires_at, status: 'active',
    };
  }

  function extractKey(init, bodyText) {
    let key = '';
    try {
      const j = JSON.parse(bodyText || '{}');
      key = j.licenseKey || j.key || j.license || '';
    } catch (_) {}
    if (!key && init && init.headers) {
      const h = init.headers;
      if (typeof h.get === 'function') {
        key = h.get('X-License-Key') || h.get('x-license-key') || '';
      } else if (typeof h === 'object') {
        key = h['X-License-Key'] || h['x-license-key'] || '';
      }
    }
    return String(key || '').trim().toUpperCase();
  }

  function saveToStorage(key, result) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({
          ql_license_key: key, ql_license_valid: true,
          eu_license_key: key, eu_license_valid: true,
          eu_expires_at: result.expires_at || null,
          eu_plan: result.plan || null,
        });
      }
    } catch (_) {}
  }

  const _fetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    const method = ((init && init.method) || 'GET').toUpperCase();

    const isLicenseValidate =
      /io\.eklas\.dev\/api\/v1\/licenses\/validate/i.test(url) ||
      /io\.eklas\.dev\/api\/v1\/license[^s]/i.test(url);

    const isSessionCall =
      /io\.eklas\.dev\/api\/v1\/lovable\/session/i.test(url);

    const isChatCall =
      /io\.eklas\.dev\/api\/v1\/lovable\/chat/i.test(url);

    const isOtherLovableCall =
      /io\.eklas\.dev\/api\/v1\/lovable\//i.test(url) &&
      !isSessionCall && !isChatCall;

    if (method === 'POST' && (isLicenseValidate || isSessionCall || isChatCall || isOtherLovableCall)) {
      let bodyText = '';
      try { bodyText = (init && init.body) ? String(init.body) : ''; } catch (_) {}

      const key = extractKey(init, bodyText);

      if (isOwnFormat(key)) {
        try {
          const result = await validateOwn(key);

          if (result.ok) {
            saveToStorage(key, result);

            if (isSessionCall) {
              return new Response(JSON.stringify(licenseSuccessBody(key, result)), {
                status: 200, headers: { 'Content-Type': 'application/json' },
              });
            }

            if (isChatCall) {
              return new Response(JSON.stringify({
                ok: true,
                sessionId: 'own-' + Date.now(),
                licenseKey: key,
                status: 'active',
              }), {
                status: 200, headers: { 'Content-Type': 'application/json' },
              });
            }

            return new Response(JSON.stringify(licenseSuccessBody(key, result)), {
              status: 200, headers: { 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify({ ok: false, error: result.error || 'Invalid license' }), {
            status: 403, headers: { 'Content-Type': 'application/json' },
          });
        } catch (e) {
          return new Response(JSON.stringify({ ok: false, error: e.message || 'Validation failed' }), {
            status: 500, headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }

    return _fetch(input, init);
  };
})();
