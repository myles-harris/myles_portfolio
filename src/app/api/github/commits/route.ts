import { NextResponse } from 'next/server';

interface GitHubRepo {
  name: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  repository: {
    name: string;
  };
}

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME || 'mylesharris';
    
    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    // First get user's repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!reposResponse.ok) {
      throw new Error(`GitHub API error: ${reposResponse.status}`);
    }

    const repos: GitHubRepo[] = await reposResponse.json();
    
    // Get recent commits from each repository
    const commitsPromises = repos.map(async (repo: GitHubRepo) => {
      const commitsResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/commits?per_page=3`, {
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (commitsResponse.ok) {
        const commits: GitHubCommit[] = await commitsResponse.json();
        return commits.map((commit: GitHubCommit) => ({
          ...commit,
          repository: { name: repo.name }
        }));
      }
      return [];
    });

    const allCommits = await Promise.all(commitsPromises);
    const flatCommits = allCommits.flat().sort((a: GitHubCommit, b: GitHubCommit) => 
      new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
    );

    return NextResponse.json({
      commits: flatCommits.slice(0, 10) // Limit to 10 most recent commits
    });
  } catch (error) {
    console.error('GitHub commits error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commits' },
      { status: 500 }
    );
  }
} 