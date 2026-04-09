# Contributing to Media Downloader

Thank you for your interest in contributing to Media Downloader!

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, browser, versions)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature already exists or is planned
- Describe the use case
- Explain why it would be useful

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Prerequisites

- Rust 1.75+
- Node.js 20+
- Docker (for production testing)

### Setup

```bash
# Clone the repository
git clone https://github.com/cryals/qruster.git
cd qruster

# Run setup script
./scripts/setup.sh
# Choose: Development

# Start development servers
./scripts/run.sh
```

### Code Style

**Rust:**
- Follow Rust standard style (`cargo fmt`)
- Run clippy (`cargo clippy`)
- Add tests for new features

**TypeScript/React:**
- Follow ESLint rules
- Use functional components with hooks
- Add PropTypes or TypeScript types

### Testing

```bash
# Backend tests
cd backend
cargo test

# Frontend tests
cd frontend
npm test
```

## Project Structure

```
qruster/
├── backend/          # Rust backend
├── frontend/         # React frontend
├── docs/             # Documentation
├── scripts/          # Setup and run scripts
└── docker-compose.yml
```

## Adding New Platform Support

To add support for a new platform:

1. Create a new extractor in `backend/src/extractors/`
2. Implement the `MediaExtractor` trait
3. Add detection logic in `detect_platform()`
4. Update documentation in `docs/src/*/platforms.md`
5. Add tests

Example:

```rust
pub struct NewPlatformExtractor;

#[async_trait]
impl MediaExtractor for NewPlatformExtractor {
    fn detect(&self, url: &str) -> bool {
        url.contains("newplatform.com")
    }

    async fn extract_info(&self, url: &str) -> Result<MediaInfo> {
        // Implementation
    }

    async fn get_download_url(&self, url: &str, format_id: &str) -> Result<String> {
        // Implementation
    }
}
```

## Documentation

Documentation is built with mdBook. To build locally:

```bash
cd docs
mdbook serve
# Open http://localhost:3000
```

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Questions?

Feel free to open an issue for questions or join discussions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
