# Security Policy

## 🔒 Reporting Security Vulnerabilities

If you discover a security vulnerability in the AI Study Planner project, please report it responsibly by emailing security@example.com instead of using the public issue tracker.

**Please do NOT:**
- Create a public GitHub issue for security vulnerabilities
- Publicly disclose the vulnerability before we have had a chance to patch it
- Exploit the vulnerability for any reason

**Please DO:**
- Send detailed information about the vulnerability
- Include steps to reproduce (if possible)
- Allow reasonable time for us to fix the issue (typically 30-90 days)
- Contact us at security@example.com

## 🛡️ Security Best Practices

### Environment Variables
- Never commit `.env.local` or any files containing secrets
- The `.gitignore` file is configured to exclude `.env*` files
- Always use `.env.local.example` as a template for required variables
- Rotate API keys regularly

### API Keys
- **Tambo API Key**: Keep your `NEXT_PUBLIC_TAMBO_API_KEY` secret
- Never expose API keys in public repositories
- Use environment variables for all sensitive data
- Regenerate keys if compromised

### Code Security
- All dependencies are reviewed for vulnerabilities
- Run `npm audit` regularly to check for security issues
- Keep dependencies updated: `npm update`
- Review dependency changelogs for security patches

### Data Security
- User study plans are stored in browser localStorage
- Clear sensitive data from localStorage when appropriate
- No data is sent to external services except Tambo API
- HTTPS is required for production deployments

## 🔐 Dependency Security

### Checking Dependencies
```bash
# Audit dependencies for vulnerabilities
npm audit

# Fix known vulnerabilities automatically
npm audit fix

# Check for outdated packages
npm outdated
```

### Updating Dependencies
```bash
# Update to latest patch version
npm update

# Update to latest version (may include breaking changes)
npm install package@latest
```

## 🚀 Security Updates

- We will announce security patches via GitHub releases
- Security updates are highest priority
- Patch releases (e.g., 1.0.1) may be released for security fixes
- Subscribe to releases to stay informed

## 📋 Vulnerability Disclosure Timeline

1. **Report received** → Acknowledged within 48 hours
2. **Verification** → We verify and investigate (1-7 days)
3. **Development** → Fix is prepared (1-14 days)
4. **Review** → Fix is reviewed and tested (1-7 days)
5. **Release** → Security patch is released
6. **Public disclosure** → Vulnerability is publicly disclosed after patch is released

## 🔑 Secure Configuration

### Required Setup
```bash
# 1. Install dependencies securely
npm ci  # Use npm ci instead of npm install in production

# 2. Create .env.local from template
cp .env.local.example .env.local

# 3. Add your Tambo API key (keep it secret!)
# Edit .env.local and add: NEXT_PUBLIC_TAMBO_API_KEY=your_key_here

# 4. Never commit .env.local
# Verify: cat .gitignore | grep ".env"
```

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm start

# IMPORTANT: Set environment variables on your hosting platform
# DO NOT include .env files in your deployment
```

## 📞 Contact

- **Security Email**: security@example.com
- **Response Time**: 48 hours (maximum)
- **Preferred Language**: English

## 📚 Additional Resources

- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [npm Security](https://docs.npmjs.com/cli/v8/using-npm/security)

## 🎯 Security Roadmap

- [ ] Regular dependency audits (monthly)
- [ ] Security headers implementation
- [ ] Content Security Policy (CSP) configuration
- [ ] Rate limiting for API endpoints
- [ ] Input validation and sanitization improvements
- [ ] Regular security testing

---

**Last Updated**: February 8, 2026  
**Maintained By**: AI Study Planner Team

Thank you for helping keep AI Study Planner secure! 🙏
