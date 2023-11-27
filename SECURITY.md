
## Goods practices to follow

:warning:**You must never store credentials information into source code or config file in a GitHub repository**
- Block sensitive data being pushed to GitHub by git-secrets or its likes as a git pre-commit hook
- Audit for slipped secrets with dedicated tools
- Use environment variables for secrets in CI/CD (e.g. GitHub Secrets) and secret managers in production

# Security Policy

## Supported Versions

Use this section to tell people about which versions of your project are currently being supported with security updates.

| Version | Supported          |
|---------| ------------------ |
| 1.0     | :white_check_mark: |


## Reporting a Vulnerability

To report a vulnerability, open an issue on github : https://github.com/ThalesGroup/peter for the branch that is concern.
Tell them where to go, how often they can expect to get an update on a reported vulnerability, what to expect if the vulnerability is accepted or declined, etc.

## Disclosure policy

Open an issue on Github : https://github.com/ThalesGroup/peter, describe what security breach you found, what tools you used.

## Security Update policy

The security breach will be closed when the issue about the security breach will be closed

## Security related configuration

Settings users should consider that would impact the security posture of deploying this project, such as HTTPS, authorization and many others.

## Known security gaps & future enhancements

Security will be improved and updated on each patch.
