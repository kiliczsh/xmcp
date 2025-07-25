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
  try {
    execSync("git rev-parse --git-dir", {
      stdio: "pipe",
      cwd: path,
    });
    return "git";
  } catch {
  }

  try {
    execSync("hg root", {
      stdio: "pipe",
      cwd: path,
    });
    return "mercurial";
  } catch {
    if (existsSync(join(path, ".hg"))) {
      return "mercurial";
    }
  }

  try {
    execSync("jj log -l 1", {
      stdio: "pipe",
      cwd: path,
    });
    return "jujutsu";
  } catch {
    if (existsSync(join(path, ".jj"))) {
      return "jujutsu";
    }
  }

  return "none";
}

/**
 * Initialize git repository in the specified directory
 * Follows safe initialization: check prerequisites → avoid conflicts → init → stage → conditional commit
 */
export function initGit(path: string): boolean {
  const spinner = ora();

  try {
    if (!isGitInstalled()) {
      console.log(
        chalk.yellow("\nGit is not installed. Skipping git initialization.")
      );
      return false;
    }

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

    execSync("git init", {
      stdio: "pipe",
      cwd: path,
    });

    execSync("git add -A", {
      stdio: "pipe",
      cwd: path,
    });

    if (hasGitUserConfig()) {
      execSync('git commit -m "Initial commit from create-xmcp-app"', {
        stdio: "pipe",
        cwd: path,
      });
      spinner.succeed("Git repository initialized with initial commit");
    } else {
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
    spinner.fail("Failed to initialize git repository");
    console.error(chalk.red("\nError details:"), error);
    return false;
  }
}
