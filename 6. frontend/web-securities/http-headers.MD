# HTTP Headers for Web Security

HTTP headers are a critical component of web security. They inform browsers and servers how to handle requests and responses, protecting against various types of attacks.

## Essential Security Headers

### 1. Content-Security-Policy (CSP)
Prevents XSS (Cross-Site Scripting) attacks by restricting which sources can load resources.

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' fonts.googleapis.com
```

**Directives:**
- `default-src`: Default policy for all content types
- `script-src`: Controls script execution
- `style-src`: Controls stylesheet loading
- `img-src`: Controls image sources
- `font-src`: Controls font sources
- `connect-src`: Restricts URLs for XHR, WebSocket, EventSource
- `frame-src`: Controls iframe sources

### 2. X-Content-Type-Options
Prevents MIME type sniffing attacks by forcing the browser to respect the declared Content-Type.

```
X-Content-Type-Options: nosniff
```

**Values:**
- `nosniff`: Browser must respect the Content-Type header; prevents IE from sniffing

### 3. X-Frame-Options
Protects against clickjacking attacks by controlling whether the page can be embedded in iframes.

```
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN
X-Frame-Options: ALLOW-FROM https://example.com
```

**Values:**
- `DENY`: Page cannot be displayed in a frame
- `SAMEORIGIN`: Page can only be displayed in a frame on the same origin
- `ALLOW-FROM uri`: Page can only be displayed in a frame on the specified origin (deprecated, use CSP `frame-ancestors` instead)

### 4. X-XSS-Protection
Provides legacy XSS protection for older browsers (now largely superseded by CSP).

```
X-XSS-Protection: 1; mode=block
```

**Values:**
- `0`: Disables XSS protection
- `1`: Enables XSS protection
- `mode=block`: Block page if XSS detected (instead of sanitizing)

### 5. Strict-Transport-Security (HSTS)
Forces browsers to communicate over HTTPS only, preventing downgrade attacks.

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Parameters:**
- `max-age`: Seconds to remember HTTPS-only policy (typically 1 year = 31536000)
- `includeSubDomains`: Apply policy to all subdomains
- `preload`: Allow inclusion in browser HSTS preload lists

### 6. Referrer-Policy
Controls how much referrer information is shared when navigating to other sites.

```
Referrer-Policy: strict-origin-when-cross-origin
```

**Values:**
- `no-referrer`: Never send referrer
- `no-referrer-when-downgrade`: Only downgrade if moving from HTTPS to HTTP
- `same-origin`: Only send referrer for same-origin requests
- `origin`: Send only the origin, not the full URL
- `origin-when-cross-origin`: Send origin for cross-origin, full URL for same-origin
- `strict-origin-when-cross-origin`: Stricter version (recommended)
- `unsafe-url`: Always send full URL (least secure)

### 7. Permissions-Policy (formerly Feature-Policy)
Controls which browser features can be used by the page and embedded iframes.

```
Permissions-Policy: geolocation=(), microphone=(), camera=(), accelerometer=()
```

**Common directives:**
- `geolocation`: GPS access
- `microphone`: Microphone access
- `camera`: Camera access
- `payment`: Payment Request API
- `usb`: USB access
- `accelerometer`: Accelerometer access
- `gyroscope`: Gyroscope access

### 8. Cross-Origin-Embedder-Policy (COEP)
Requires embedded resources to be either same-origin or explicitly marked as cross-origin.

```
Cross-Origin-Embedder-Policy: require-corp
```

**Values:**
- `require-corp`: Embedded resources must allow cross-origin access
- `credentialless`: Resources can be loaded without CORS credentials

### 9. Cross-Origin-Opener-Policy (COOP)
Isolates the document from cross-origin window openers.

```
Cross-Origin-Opener-Policy: same-origin
```

**Values:**
- `same-origin`: Isolates from cross-origin openers
- `same-origin-allow-popups`: Allows cross-origin popups but isolates from openers

### 10. Cross-Origin-Resource-Policy (CORP)
Indicates whether the resource can be loaded cross-origin.

```
Cross-Origin-Resource-Policy: same-origin
```

**Values:**
- `same-origin`: Only same-origin requests
- `same-site`: Only same-site requests
- `cross-origin`: Cross-origin requests allowed

## Additional Security Headers

### 11. Expect-CT
Enforces certificate transparency (largely superseded by browser improvements).

```
Expect-CT: max-age=86400, enforce
```

### 12. Set-Cookie Attributes
Control cookie security:

```
Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600
```

**Attributes:**
- `Secure`: Only send over HTTPS
- `HttpOnly`: Prevent JavaScript access (mitigates XSS)
- `SameSite=Strict|Lax|None`: CSRF protection (Strict most secure, None requires Secure)
- `Path`: Cookie scope
- `Domain`: Cookie domain scope
- `Max-Age`: Cookie lifetime in seconds
- `Expires`: Cookie expiration date

### 13. Cache-Control
Controls caching behavior for sensitive data.

```
Cache-Control: no-store, no-cache, must-revalidate, max-age=0
```

**Directives:**
- `no-store`: Don't cache anywhere
- `no-cache`: Validate before using cached version
- `must-revalidate`: Can't use stale cache
- `max-age=0`: Immediately stale

### 14. X-Permitted-Cross-Domain-Policies
Controls crossdomain.xml file access for Flash/older plugins.

```
X-Permitted-Cross-Domain-Policies: none
```

## Recommended Security Header Configuration

For a modern web application:

```
Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com; style-src 'self' fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self'; frame-ancestors 'none'

X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block

Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

Referrer-Policy: strict-origin-when-cross-origin

Permissions-Policy: geolocation=(), microphone=(), camera=()

Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin

Cache-Control: no-store, no-cache, must-revalidate, max-age=0
```

## Implementation in Different Frameworks

### Express.js
```javascript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Or use helmet middleware
const helmet = require('helmet');
app.use(helmet());
```

### Apache
```apache
<IfModule mod_headers.c>
  Header set Content-Security-Policy "default-src 'self'"
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
```

### Nginx
```nginx
add_header Content-Security-Policy "default-src 'self'";
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "DENY";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

## Testing Security Headers

Use tools to verify headers:
- [securityheaders.com](https://securityheaders.com)
- [mdn.github.io/observatory/](https://mdn.github.io/observatory/)
- curl: `curl -i -H "User-Agent: " https://example.com | grep -i "^[a-z-]*:"`

## Key Takeaways

1. **CSP** is your primary XSS defense
2. **HSTS** ensures HTTPS-only communication
3. **X-Frame-Options** or **CSP frame-ancestors** prevents clickjacking
4. **X-Content-Type-Options: nosniff** prevents MIME sniffing
5. **SameSite cookies** provide CSRF protection
6. **Secure + HttpOnly** on cookies prevents interception and XSS theft
7. **Permissions-Policy** limits dangerous API access
8. Implement layered security - don't rely on headers alone

## Related Concepts

- CORS (Cross-Origin Resource Sharing)
- CSRF (Cross-Site Request Forgery)
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME sniffing
- Man-in-the-Middle attacks
