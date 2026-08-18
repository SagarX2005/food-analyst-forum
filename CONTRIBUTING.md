# 🤝 Contributing Guidelines & Strategy

Thank you for contributing to **Food Analyst Forum**! This repository follows strict enterprise engineering practices.

---

## 🌿 Branching Strategy

We follow the **Git Flow / GitHub Flow hybrid model**:

- `main`: Production-ready code only. Deployments to production trigger automatically on merge to `main`.
- `develop`: Staging environment branch. Integration branch for completed feature branches.
- `feature/[feature-name]`: New features (e.g., `feature/food-sample-upload`).
- `fix/[bug-description]`: Bug fixes (e.g., `fix/auth-cookie-refresh`).
- `chore/[task-description]`: Tooling, configs, dependency updates.

---

## 📝 Commit Strategy

We enforce the **Conventional Commits** standard using `commitlint` and `husky`:

### Format: `<type>(<scope>): <short summary>`

### Allowed Types:

- `feat`: A new feature for the user.
- `fix`: A bug fix.
- `docs`: Documentation changes.
- `style`: Formatting, missing semi-colons, no code logic changes.
- `refactor`: Refactoring production code without changing behavior.
- `test`: Adding or correcting tests.
- `chore`: Updating build tasks, package manager configs, etc.

### Examples:

- `feat(food-analysis): add composition chart export`
- `fix(auth): correct token refresh error handling in middleware`
- `docs(readme): update quickstart setup instructions`

---

## 🔄 Pull Request Checklist

Before submitting a Pull Request:

1. [ ] Branch is up to date with `develop`.
2. [ ] All TypeScript checks pass: `pnpm run type-check`.
3. [ ] All ESLint checks pass: `pnpm run lint`.
4. [ ] All Prettier formatting checks pass: `pnpm run format:check`.
5. [ ] All Vitest unit tests pass: `pnpm run test`.
6. [ ] PR has a clear description detailing changes and verification steps.
