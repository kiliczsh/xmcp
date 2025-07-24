import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import ora from "ora";

/**
 * Check if git is installed on the system
 */
function isGitInstalled(): boolean {
  try {
    execSync("git --version", { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if git user config is set
 */
function hasGitUserConfig(): boolean {
  try {
    const userName = execSync("git config user.name", { stdio: "pipe" })
      .toString()
      .trim();
    const userEmail = execSync("git config user.email", { stdio: "pipe" })
      .toString()
      .trim();
    return Boolean(userName && userEmail);
  } catch {
    return false;
  }
}

/**
 * Detect which VCS system (if any) is being used in the directory
 * We check in order of popularity: Git → Mercurial → Jujutsu
 * Using command-based detection first ensures we find active repos, not just abandoned directories
 */
function detectExistingVCS(
  path: string
): "git" | "mercurial" | "jujutsu" | "none" {
  // Git check: use rev-parse which is the standard way to detect git repos
  // This works even in subdirectories and handles all git repository types
  try {
    execSync("git rev-parse --git-dir", {
      stdio: "pipe",
      cwd: path,
    });
    return "git";
  } catch {
    // Not a git repository, continue checking other VCS systems
  }

  // Mercurial check: 'hg root' reliably detects if we're in a Mercurial working copy
  try {
    execSync("hg root", {
      stdio: "pipe",
      cwd: path,
    });
    return "mercurial";
  } catch {
    // Command failed (hg not installed or not in repo), try filesystem check
    // This catches cases where .hg exists but hg command isn't available
    if (existsSync(join(path, ".hg"))) {
      return "mercurial";
    }
  }

  // Jujutsu check: 'jj log -l 1' is lightweight and confirms repo is functional
  try {
    execSync("jj log -l 1", {
      stdio: "pipe",
      cwd: path,
    });
    return "jujutsu";
  } catch {
    // Command failed (jj not installed or not in repo), try filesystem check
    // This catches cases where .jj exists but jj command isn't available
    if (existsSync(join(path, ".jj"))) {
      return "jujutsu";
    }
  }

  // No VCS detected - safe to initialize git
  return "none";
}

/**
 * Initialize git repository in the specified directory
 * Follows safe initialization: check prerequisites → avoid conflicts → init → stage → conditional commit
 */
export function initGit(path: string): boolean {
  const spinner = ora();

  try {
    // PREREQUISITE CHECK: Ensure git is available before attempting anything
    // Fail fast if git isn't installed rather than failing during init
    if (!isGitInstalled()) {
      console.log(
        chalk.yellow("\nGit is not installed. Skipping git initialization.")
      );
      return false;
    }

    // CONFLICT AVOIDANCE: Don't initialize git inside existing VCS repositories
    // This prevents nested repos and respects existing version control choices
    const existingVCS = detectExistingVCS(path);
    if (existingVCS !== "none") {
      const vcsName =
        existingVCS === "git"
          ? "Git"
          : existingVCS === "mercurial"
            ? "Mercurial"
            : "Jujutsu";
      console.log(
        chalk.blue(
          `\nAlready inside a ${vcsName} repository. Skipping git initialization.`
        )
      );
      return false;
    }

    spinner.start("Initializing git repository");

    // STEP 1: Create the git repository structure
    execSync("git init", {
      stdio: "pipe",
      cwd: path,
    });

    // STEP 2: Stage all project files for the initial commit
    // This ensures the entire generated project is tracked from the start
    execSync("git add -A", {
      stdio: "pipe",
      cwd: path,
    });

    // STEP 3: Conditional commit based on user configuration
    // Only auto-commit if user has name/email configured to avoid git errors
    if (hasGitUserConfig()) {
      execSync('git commit -m "Initial commit from create-xmcp-app"', {
        stdio: "pipe",
        cwd: path,
      });
      spinner.succeed("Git repository initialized with initial commit");
    } else {
      // Files are staged but not committed - let user configure git first
      // This prevents the common "Please tell me who you are" git error
      spinner.succeed("Git repository initialized (files staged)");
      console.log(
        chalk.yellow(
          "\nGit user configuration not found. To make your first commit, run:"
        )
      );
      console.log(chalk.cyan('  git config --global user.name "Your Name"'));
      console.log(
        chalk.cyan('  git config --global user.email "your.email@example.com"')
      );
      console.log(chalk.cyan('  git commit -m "Initial commit"'));
    }
    return true;
  } catch (error) {
    // If any step fails, show error but don't crash the entire project creation
    spinner.fail("Failed to initialize git repository");
    console.error(chalk.red("\nError details:"), error);
    return false;
  }
}
