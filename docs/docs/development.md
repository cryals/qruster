---
sidebar_position: 5
---

# Development Guide

This guide will help you set up a development environment and contribute to Media Downloader.

## Prerequisites

- **Rust** 1.77+ with Cargo
- **Node.js** 20+ with npm
- **FFmpeg** installed and in PATH
- **yt-dlp** installed and in PATH
- **Git** for version control

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/cryals/qruster.git
cd qruster
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies and build
cargo build

# Run in development mode with hot reload
cargo watch -x run

# Or run directly
cargo run
```

Backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Build for production
npm run build
```

Frontend will start on `http://localhost:3000`

## Project Structure

```
qruster/
├── backend/              # Rust backend
│   ├── src/
│   │   ├── main.rs      # Entry point
│   │   ├── handlers/    # HTTP handlers
│   │   ├── extractors/  # Platform extractors
│   │   └── services/    # Business logic
│   ├── Cargo.toml       # Rust dependencies
│   └── Dockerfile       # Backend container
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.tsx      # Main component
│   │   ├── components/  # React components
│   │   ├── services/    # API clients
│   │   └── theme/       # MUI theme
│   ├── package.json     # Node dependencies
│   └── Dockerfile       # Frontend container
│
├── docs/                # Docusaurus documentation
│   ├── docs/            # English docs
│   ├── i18n/ru/         # Russian docs
│   └── docusaurus.config.ts
│
├── scripts/             # Setup and run scripts
│   ├── setup.sh
│   ├── setup.bat
│   ├── run.sh
│   └── run.bat
│
├── docker-compose.yml   # Docker orchestration
├── Caddyfile           # Reverse proxy config
└── README.md           # Project overview
```

## Development Workflow

### Backend Development

**Running Tests:**
```bash
cd backend
cargo test
```

**Linting:**
```bash
cargo clippy -- -D warnings
```

**Formatting:**
```bash
cargo fmt
```

**Adding a New Platform Extractor:**

1. Create a new file in `backend/src/extractors/`:
```rust
// backend/src/extractors/newplatform.rs
use super::{MediaExtractor, MediaInfo, Format};
use anyhow::Result;

pub struct NewPlatformExtractor;

impl MediaExtractor for NewPlatformExtractor {
    async fn extract(&self, url: &str) -> Result<MediaInfo> {
        // Implementation
        todo!()
    }

    fn supports(&self, url: &str) -> bool {
        url.contains("newplatform.com")
    }
}
```

2. Register in `backend/src/extractors/mod.rs`:
```rust
mod newplatform;
pub use newplatform::NewPlatformExtractor;

// Add to detect_platform function
pub fn detect_platform(url: &str) -> Box<dyn MediaExtractor> {
    // ... existing platforms
    if NewPlatformExtractor.supports(url) {
        return Box::new(NewPlatformExtractor);
    }
    // ...
}
```

### Frontend Development

**Running Tests:**
```bash
cd frontend
npm test
```

**Linting:**
```bash
npm run lint
```

**Type Checking:**
```bash
npm run type-check
```

**Adding a New Component:**

1. Create component file:
```tsx
// frontend/src/components/NewComponent.tsx
import React from 'react';
import { Box } from '@mui/material';

interface NewComponentProps {
  // props
}

export const NewComponent: React.FC<NewComponentProps> = (props) => {
  return (
    <Box>
      {/* component content */}
    </Box>
  );
};
```

2. Export from index:
```tsx
// frontend/src/components/index.ts
export { NewComponent } from './NewComponent';
```

## Code Style

### Rust

Follow the official [Rust Style Guide](https://doc.rust-lang.org/1.0.0/style/):

- Use `snake_case` for functions and variables
- Use `PascalCase` for types and traits
- Use 4 spaces for indentation
- Maximum line length: 100 characters
- Always use `cargo fmt` before committing

**Example:**
```rust
pub async fn extract_media_info(url: &str) -> Result<MediaInfo> {
    let platform = detect_platform(url);
    let info = platform.extract(url).await?;
    Ok(info)
}
```

### TypeScript/React

Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript):

- Use `camelCase` for variables and functions
- Use `PascalCase` for components and types
- Use 2 spaces for indentation
- Use functional components with hooks
- Always use TypeScript types

**Example:**
```tsx
interface MediaInfo {
  title: string;
  duration: number;
}

export const MediaPreview: React.FC<{ info: MediaInfo }> = ({ info }) => {
  const [loading, setLoading] = useState(false);
  
  return (
    <Box>
      <Typography>{info.title}</Typography>
    </Box>
  );
};
```

## Testing

### Backend Tests

```bash
# Run all tests
cargo test

# Run specific test
cargo test test_youtube_extractor

# Run with output
cargo test -- --nocapture
```

**Example Test:**
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_youtube_extractor() {
        let extractor = YouTubeExtractor;
        let url = "https://youtube.com/watch?v=dQw4w9WgXcQ";
        
        assert!(extractor.supports(url));
        
        let result = extractor.extract(url).await;
        assert!(result.is_ok());
    }
}
```

### Frontend Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

**Example Test:**
```tsx
import { render, screen } from '@testing-library/react';
import { URLInput } from './URLInput';

test('renders URL input field', () => {
  render(<URLInput onSubmit={() => {}} />);
  const input = screen.getByPlaceholderText(/enter url/i);
  expect(input).toBeInTheDocument();
});
```

## Debugging

### Backend Debugging

**Enable debug logging:**
```bash
RUST_LOG=debug cargo run
```

**Using rust-lldb:**
```bash
rust-lldb target/debug/backend
```

### Frontend Debugging

**React DevTools:**
- Install [React Developer Tools](https://react.dev/learn/react-developer-tools)
- Open browser DevTools → React tab

**Network Debugging:**
- Open browser DevTools → Network tab
- Filter by XHR to see API calls

## Documentation

### Backend Documentation

Generate and view Rust docs:
```bash
cargo doc --open
```

### Frontend Documentation

The frontend uses JSDoc comments:
```tsx
/**
 * Extract media information from URL
 * @param url - The media URL
 * @returns Promise with media info
 */
export async function extractMedia(url: string): Promise<MediaInfo> {
  // ...
}
```

### Project Documentation

Documentation is built with Docusaurus:

```bash
cd docs

# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build
```

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

**Examples:**
- `feature/add-instagram-support`
- `fix/youtube-extraction-error`
- `docs/update-api-reference`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

**Examples:**
```
feat(extractors): add Instagram support

fix(download): handle timeout errors properly

docs(api): update endpoint documentation
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Run linters and tests
6. Commit with conventional commits
7. Push to your fork
8. Open a pull request

**PR Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Testing
How to test the changes

## Checklist
- [ ] Tests pass
- [ ] Linters pass
- [ ] Documentation updated
```

## Common Issues

### Port Already in Use

```bash
# Find process
lsof -i :8080
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Rust Compilation Errors

```bash
# Update Rust
rustup update

# Clean build
cargo clean
cargo build
```

### npm Install Fails

```bash
# Clear cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules package-lock.json
npm install
```

## Performance Optimization

### Backend

- Use `cargo build --release` for production
- Enable LTO in `Cargo.toml`:
```toml
[profile.release]
lto = true
codegen-units = 1
```

### Frontend

- Use code splitting
- Lazy load components
- Optimize bundle size:
```bash
npm run build -- --analyze
```

## Security

### Backend

- Never log sensitive data
- Validate all user input
- Use prepared statements for SQL
- Keep dependencies updated:
```bash
cargo audit
```

### Frontend

- Sanitize user input
- Use HTTPS in production
- Keep dependencies updated:
```bash
npm audit
npm audit fix
```

## Resources

- [Rust Book](https://doc.rust-lang.org/book/)
- [Axum Documentation](https://docs.rs/axum/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)

## Getting Help

- Open an issue on [GitHub](https://github.com/cryals/qruster/issues)
- Check existing issues and discussions
